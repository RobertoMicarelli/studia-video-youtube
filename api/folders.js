/**
 * API Route per Google Drive - Recupero cartelle esistenti
 * Richiede autenticazione OAuth 2.0
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { accessToken } = req.query;

    if (!accessToken) {
      return res.status(400).json({ error: 'Access token richiesto' });
    }

    const driveFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    if (!driveFolderId) {
      return res.status(500).json({ error: 'Google Drive folder ID non configurato' });
    }

    // Recupera tutte le cartelle nella cartella principale
    const searchResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${driveFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false&fields=files(id,name)&orderBy=name`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!searchResponse.ok) {
      const errorData = await searchResponse.json().catch(() => ({}));
      return res.status(searchResponse.status).json({ 
        error: `Google Drive API error: ${errorData.error?.message || searchResponse.statusText}` 
      });
    }

    const searchData = await searchResponse.json();
    const folders = searchData.files || [];

    // Estrai solo i nomi delle cartelle e ordina
    const folderNames = folders.map(folder => folder.name).sort();

    return res.status(200).json({
      success: true,
      folders: folderNames
    });

  } catch (error) {
    console.error('Errore Google Drive API (folders):', error);
    return res.status(500).json({ 
      error: 'Errore interno del server',
      message: error.message 
    });
  }
}
