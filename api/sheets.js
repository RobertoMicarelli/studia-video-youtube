/**
 * API Route per Google Sheets - Tracciamento documenti
 * Richiede autenticazione OAuth 2.0
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { timestamp, title, url, docUrl, category, abstract, accessToken } = req.body;

    if (!timestamp || !title || !url || !docUrl || !accessToken) {
      return res.status(400).json({ error: 'Parametri mancanti' });
    }

    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    if (!spreadsheetId) {
      return res.status(500).json({ error: 'Google Sheets ID non configurato' });
    }

    // Aggiungi riga al foglio
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:append?valueInputOption=RAW`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: [[
            timestamp,
            title,
            url,
            docUrl,
            category || 'FORMAZIONE',
            abstract || ''
          ]]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({ 
        error: `Google Sheets API error: ${errorData.error?.message || response.statusText}` 
      });
    }

    const result = await response.json();

    return res.status(200).json({
      success: true,
      updatedRange: result.updates?.updatedRange
    });

  } catch (error) {
    console.error('Errore Google Sheets API:', error);
    return res.status(500).json({ 
      error: 'Errore interno del server',
      message: error.message 
    });
  }
}

