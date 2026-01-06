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

    // Prepara l'abstract (assicurati che non sia vuoto)
    console.log('=== GOOGLE SHEETS API - RICEZIONE DATI ===');
    console.log('Abstract ricevuto (tipo):', typeof abstract);
    console.log('Abstract ricevuto (valore):', abstract);
    console.log('Abstract ricevuto (lunghezza):', abstract ? abstract.length : 0);
    
    const abstractText = abstract && abstract.trim() && abstract.trim() !== 'Dispensa didattica generata da video YouTube' 
      ? abstract.trim() 
      : (abstract && abstract.trim() ? abstract.trim() : 'Dispensa didattica generata da video YouTube');
    
    console.log('Google Sheets - Dati da inserire:', {
      timestamp,
      title: title.substring(0, 50),
      category,
      abstractLength: abstractText.length,
      abstractPreview: abstractText.substring(0, 200),
      abstractFull: abstractText // Log completo per debug
    });
    console.log('=== FINE LOG GOOGLE SHEETS API ===');

    // Trova la prima riga vuota
    // Leggi le righe esistenti per trovare la prima vuota
    const readResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A:A?majorDimension=COLUMNS`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    let nextRow = 2; // Default: seconda riga (dopo intestazione)
    
    if (readResponse.ok) {
      const readData = await readResponse.json();
      const rows = readData.values && readData.values[0] ? readData.values[0] : [];
      
      // Trova la prima riga vuota (dopo l'intestazione)
      // L'intestazione è nella riga 1, quindi iniziamo dalla riga 2
      for (let i = 1; i < rows.length; i++) {
        if (!rows[i] || rows[i].trim() === '') {
          nextRow = i + 1; // +1 perché le righe partono da 1
          break;
        }
      }
      
      // Se tutte le righe sono piene, usa la riga successiva
      if (nextRow === 2 && rows.length > 1) {
        nextRow = rows.length + 1;
      }
    }

    // Aggiungi riga alla posizione trovata
    const range = `A${nextRow}:F${nextRow}`;
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=RAW`,
      {
        method: 'PUT',
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
            abstractText
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

