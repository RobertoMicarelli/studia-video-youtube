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

    // Trova o crea cartella per categoria
    const categoryName = category || 'FORMAZIONE';
    let categoryFolderId = null;

    // Cerca se esiste già una cartella con questo nome
    const searchResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=name='${encodeURIComponent(categoryName)}' and '${driveFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      if (searchData.files && searchData.files.length > 0) {
        categoryFolderId = searchData.files[0].id;
      }
    }

    // Se non esiste, creala
    if (!categoryFolderId) {
      const createFolderResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: categoryName,
          parents: [driveFolderId],
          mimeType: 'application/vnd.google-apps.folder'
        })
      });

      if (createFolderResponse.ok) {
        const folderData = await createFolderResponse.json();
        categoryFolderId = folderData.id;
      } else {
        // Se fallisce la creazione, usa la cartella principale
        console.warn('Errore creazione cartella categoria, uso cartella principale');
        categoryFolderId = driveFolderId;
      }
    }

    // Crea il documento Google Docs nella cartella categoria
    const createResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: title,
        parents: [categoryFolderId],
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

    // Prepara il contenuto: rimuovi markdown e crea testo pulito
    let textContent = content
      .replace(/\*\*(.+?)\*\*/g, '$1') // Rimuovi **
      .replace(/\*(.+?)\*/g, '$1') // Rimuovi *
      .replace(/^#+\s*/gm, '') // Rimuovi # dai titoli
      .trim();

    // Inserisci il testo nel documento usando Google Docs API
    const insertRequest = {
      requests: [{
        insertText: {
          location: { index: 1 },
          text: textContent
        }
      }]
    };

    const insertResponse = await fetch(
      `https://docs.googleapis.com/v1/documents/${fileId}:batchUpdate`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(insertRequest)
      }
    );

    if (!insertResponse.ok) {
      const errorData = await insertResponse.json().catch(() => ({}));
      console.warn('Errore inserimento testo, documento creato ma vuoto:', errorData);
      // Il documento è stato creato, anche se il contenuto non è stato inserito
    }

    const docUrl = `https://docs.google.com/document/d/${fileId}/edit`;

    return res.status(200).json({
      success: true,
      docUrl,
      docId: fileId,
      category: categoryName,
      categoryFolderId: categoryFolderId
    });

  } catch (error) {
    console.error('Errore Google Drive API:', error);
    return res.status(500).json({ 
      error: 'Errore interno del server',
      message: error.message 
    });
  }
}
