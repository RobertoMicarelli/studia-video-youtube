/**
 * API Route per gestire l'autenticazione OAuth 2.0 con Google
 * Genera URL di autorizzazione e gestisce il callback
 */

export default async function handler(req, res) {
  const { method, query } = req;

  // Endpoint di debug (rimuovere in produzione)
  if (method === 'GET' && query.action === 'debug') {
    return res.status(200).json({
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasRedirectUri: !!process.env.GOOGLE_REDIRECT_URI,
      clientIdPrefix: process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.substring(0, 20) + '...' : 'NOT SET',
      redirectUri: process.env.GOOGLE_REDIRECT_URI || 'NOT SET',
      origin: req.headers.origin,
      host: req.headers.host
    });
  }

  // Genera URL di autorizzazione
  if (method === 'GET' && query.action === 'auth-url') {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    // Usa il redirect URI configurato o genera da origin
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 
      `${req.headers.origin || req.headers.host ? `https://${req.headers.host}` : 'http://localhost:3000'}/api/auth?action=callback`;
    
    if (!clientId) {
      return res.status(500).json({ error: 'Google Client ID non configurato' });
    }

    const scopes = [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/spreadsheets'
    ].join(' ');

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `access_type=offline&` +
      `prompt=consent`;

    return res.status(200).json({ authUrl });
  }

  // Gestisci callback OAuth
  if (method === 'GET' && query.action === 'callback') {
    const { code } = query;
    
    if (!code) {
      return res.status(400).json({ error: 'Code non fornito' });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 
      `${req.headers.origin || (req.headers.host ? `https://${req.headers.host}` : 'http://localhost:3000')}/api/auth?action=callback`;

    if (!clientId || !clientSecret) {
      console.error('OAuth Config Error:', {
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret,
        hasRedirectUri: !!redirectUri,
        redirectUri: redirectUri
      });
      return res.status(500).json({ 
        error: 'Credenziali Google non configurate',
        details: `Client ID: ${clientId ? 'presente' : 'mancante'}, Client Secret: ${clientSecret ? 'presente' : 'mancante'}, Redirect URI: ${redirectUri || 'mancante'}`
      });
    }

    try {
      // Scambia code con access token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        })
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json().catch(() => ({}));
        const errorText = await tokenResponse.text().catch(() => '');
        console.error('OAuth Token Error:', {
          status: tokenResponse.status,
          statusText: tokenResponse.statusText,
          error: errorData,
          errorText: errorText,
          redirectUri: redirectUri,
          clientId: clientId ? clientId.substring(0, 20) + '...' : 'MISSING',
          hasClientSecret: !!clientSecret,
          requestBody: {
            code: code ? 'presente' : 'mancante',
            client_id: clientId ? 'presente' : 'mancante',
            redirect_uri: redirectUri
          }
        });
        return res.status(tokenResponse.status).json({ 
          error: `Errore autenticazione: ${errorData.error || tokenResponse.statusText}`,
          details: errorData.error_description || errorText || 'Verifica che GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET e GOOGLE_REDIRECT_URI siano configurati correttamente in Vercel',
          debug: {
            redirectUri: redirectUri,
            hasClientId: !!clientId,
            hasClientSecret: !!clientSecret
          }
        });
      }

      const tokens = await tokenResponse.json();

      // Reindirizza alla pagina principale con il token
      return res.redirect(`/?token=${tokens.access_token}`);

    } catch (error) {
      console.error('Errore OAuth callback:', error);
      return res.status(500).json({ 
        error: 'Errore interno del server',
        message: error.message 
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

