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

    // Prepara il contenuto: converti markdown in testo formattato
    // Il nuovo prompt usa # per macro-sezioni, ## per sezioni interne, ### per sotto-paragrafi
    // Rimuovi tag H1/H2/H3 se presenti
    let textContent = content
      .replace(/H1:\s*/gi, '') // Rimuovi "H1:" o "h1:"
      .replace(/H2:\s*/gi, '') // Rimuovi "H2:" o "h2:"
      .replace(/H3:\s*/gi, '') // Rimuovi "H3:" o "h3:"
      .replace(/\*\*(.+?)\*\*/g, '$1') // Rimuovi ** (grassetto) - verrà riapplicato dopo
      .replace(/\*(.+?)\*/g, '$1') // Rimuovi * (corsivo) - verrà riapplicato dopo
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Rimuovi link markdown [testo](url) -> testo
      .trim();
    
    // Manteniamo i simboli # per poterli riconoscere e formattare correttamente

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
      console.warn('Errore inserimento testo:', errorData);
      // Il documento è stato creato, anche se il contenuto potrebbe non essere stato inserito
    } else {
      // Dopo l'inserimento, applica formattazione ai titoli
      // Leggi il documento per ottenere la struttura
      const docResponse = await fetch(
        `https://docs.googleapis.com/v1/documents/${fileId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (docResponse.ok) {
        const doc = await docResponse.json();
        const content = doc.body?.content || [];

        // Usa un approccio migliore: leggi il documento e trova i paragrafi corretti
        const formatRequests = [];
        
        // Funzione helper per estrarre testo da un elemento
        const getParagraphText = (para) => {
          if (!para.elements) return '';
          return para.elements
            .filter(el => el.textRun)
            .map(el => el.textRun.content || '')
            .join('');
        };

        // Analizza tutti i paragrafi nel documento
        const processParagraphs = (content) => {
          content.forEach(element => {
            if (element.paragraph) {
              const para = element.paragraph;
              const paraText = getParagraphText(para);
              const trimmedText = paraText.trim();
              
              // Macro-sezioni (#) - HEADING_1
              if (trimmedText.match(/^#\s+[^#]/)) {
                formatRequests.push({
                  updateParagraphStyle: {
                    range: {
                      startIndex: element.startIndex || 1,
                      endIndex: element.endIndex || (element.startIndex || 1) + paraText.length
                    },
                    paragraphStyle: {
                      namedStyleType: 'HEADING_1'
                    },
                    fields: 'namedStyleType'
                  }
                });
              }
              // Sezioni interne (##) - HEADING_2
              else if (trimmedText.match(/^##\s+[^#]/)) {
                formatRequests.push({
                  updateParagraphStyle: {
                    range: {
                      startIndex: element.startIndex || 1,
                      endIndex: element.endIndex || (element.startIndex || 1) + paraText.length
                    },
                    paragraphStyle: {
                      namedStyleType: 'HEADING_2'
                    },
                    fields: 'namedStyleType'
                  }
                });
              }
              // Sotto-paragrafi (###) - HEADING_3
              else if (trimmedText.match(/^###\s+/)) {
                formatRequests.push({
                  updateParagraphStyle: {
                    range: {
                      startIndex: element.startIndex || 1,
                      endIndex: element.endIndex || (element.startIndex || 1) + paraText.length
                    },
                    paragraphStyle: {
                      namedStyleType: 'HEADING_3'
                    },
                    fields: 'namedStyleType'
                  }
                });
              }
              // Pattern legacy per compatibilità
              else if (trimmedText.match(/^METADATI DEL VIDEO|^ABSTRACT|^CORPO DELLA DISPENSA|^SEZIONE FINALE|^Punti chiave da ricordare|^Approfondimenti suggeriti|^Applicazioni pratiche/)) {
                formatRequests.push({
                  updateParagraphStyle: {
                    range: {
                      startIndex: element.startIndex || 1,
                      endIndex: element.endIndex || (element.startIndex || 1) + paraText.length
                    },
                    paragraphStyle: {
                      namedStyleType: 'HEADING_1'
                    },
                    fields: 'namedStyleType'
                  }
                });
              }
            }
          });
        };

        processParagraphs(content);

        // Applica formattazione in batch (max 50 richieste per volta)
        if (formatRequests.length > 0) {
          for (let i = 0; i < formatRequests.length; i += 50) {
            const batch = formatRequests.slice(i, i + 50);
            const formatResponse = await fetch(
              `https://docs.googleapis.com/v1/documents/${fileId}:batchUpdate`,
              {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ requests: batch })
              }
            );
            
            if (!formatResponse.ok) {
              const errorData = await formatResponse.json().catch(() => ({}));
              console.warn('Errore applicazione formattazione batch:', errorData);
            }
          }
        }
        
        // Rimuovi i simboli # dopo aver applicato la formattazione (usa replaceAllText)
        const removeHashesRequest = {
          requests: [
            {
              replaceAllText: {
                containsText: {
                  text: '### ',
                  matchCase: false
                },
                replaceText: ''
              }
            },
            {
              replaceAllText: {
                containsText: {
                  text: '## ',
                  matchCase: false
                },
                replaceText: ''
              }
            },
            {
              replaceAllText: {
                containsText: {
                  text: '# ',
                  matchCase: false
                },
                replaceText: ''
              }
            }
          ]
        };
        
        const removeHashesResponse = await fetch(
          `https://docs.googleapis.com/v1/documents/${fileId}:batchUpdate`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(removeHashesRequest)
          }
        );
        
        if (!removeHashesResponse.ok) {
          const errorData = await removeHashesResponse.json().catch(() => ({}));
          console.warn('Errore rimozione simboli #:', errorData);
        }
      }
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
