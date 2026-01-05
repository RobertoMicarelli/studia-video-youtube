/**
 * API Route per Gmail - Invio email di notifica
 * Richiede autenticazione OAuth 2.0
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { docUrl, videoUrl, abstract, fileName, accessToken } = req.body;

    if (!docUrl || !videoUrl || !fileName || !accessToken) {
      return res.status(400).json({ error: 'Parametri mancanti' });
    }

    const recipientEmail = process.env.NOTIFICATION_EMAIL || 'roberto.micarelli@gmail.com';
    const now = new Date().toLocaleTimeString('it-IT');

    // Costruisci l'email
    const emailContent = [
      `To: ${recipientEmail}`,
      `Subject: Creazione ${fileName}`,
      `Content-Type: text/plain; charset=utf-8`,
      '',
      `Sono l'APP "Studia i tuoi Video Preferiti".`,
      '',
      `Ho generato ora ${now} un file che puoi consultare qui:`,
      docUrl,
      '',
      `Estratto da questo video YouTube:`,
      videoUrl,
      '',
      `Contenuti:`,
      abstract || 'Dispensa didattica generata da video YouTube',
      '',
      '---',
      'Dispensa generata automaticamente'
    ].join('\n');

    // Codifica in base64url
    const encodedEmail = Buffer.from(emailContent)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // Invia email tramite Gmail API
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        raw: encodedEmail
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({ 
        error: `Gmail API error: ${errorData.error?.message || response.statusText}` 
      });
    }

    const result = await response.json();

    return res.status(200).json({
      success: true,
      messageId: result.id
    });

  } catch (error) {
    console.error('Errore Gmail API:', error);
    return res.status(500).json({ 
      error: 'Errore interno del server',
      message: error.message 
    });
  }
}

