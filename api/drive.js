/**
 * API Route per Google Drive - Salvataggio documenti
 * Richiede autenticazione OAuth 2.0
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { content, title, category, accessToken } = req.body;

    if (!content || !title || !accessToken) {
      return res.status(400).json({ error: 'Content, title e accessToken sono richiesti' });
    }

    const driveFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    if (!driveFolderId) {
      return res.status(500).json({ error: 'Google Drive folder ID non configurato' });
    }

    // Crea il documento Google Docs
    const createResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: `${title}.md`,
        parents: [driveFolderId],
        mimeType: 'application/vnd.google-apps.document'
      })
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json().catch(() => ({}));
      return res.status(createResponse.status).json({ 
        error: `Google Drive API error: ${errorData.error?.message || createResponse.statusText}` 
      });
    }

    const file = await createResponse.json();
    const fileId = file.id;

    // Converti il contenuto in formato Google Docs (HTML semplice)
    const htmlContent = content
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
    
    const fullHtml = `<p>${htmlContent}</p>`;

    // Aggiorna il contenuto del documento
    const updateResponse = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: (() => {
          const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
          const formData = [
            `--${boundary}`,
            'Content-Disposition: form-data; name="metadata"',
            'Content-Type: application/json; charset=UTF-8',
            '',
            JSON.stringify({ name: `${title}.md` }),
            `--${boundary}`,
            'Content-Disposition: form-data; name="file"',
            'Content-Type: text/html',
            '',
            fullHtml,
            `--${boundary}--`
          ].join('\r\n');
          
          return formData;
        })()
      }
    );

    if (!updateResponse.ok) {
      // Se l'upload multipart fallisce, prova con files.update
      const simpleUpdate = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: `${title}.md`
          })
        }
      );
      
      if (!simpleUpdate.ok) {
        const errorData = await updateResponse.json().catch(() => ({}));
        return res.status(updateResponse.status).json({ 
          error: `Errore aggiornamento documento: ${errorData.error?.message || updateResponse.statusText}` 
        });
      }
    }

    const docUrl = `https://docs.google.com/document/d/${fileId}/edit`;

    return res.status(200).json({
      success: true,
      docUrl,
      docId: fileId,
      category: category || 'FORMAZIONE'
    });

  } catch (error) {
    console.error('Errore Google Drive API:', error);
    return res.status(500).json({ 
      error: 'Errore interno del server',
      message: error.message 
    });
  }
}

