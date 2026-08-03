/**
 * Trascrittino 2.0 — /api/v2/drive
 *
 * Crea il documento su Drive importando MARKDOWN, che Google converte in
 * formattazione nativa: titoli reali (navigabili dal pannello struttura),
 * grassetto, corsivo, elenchi puntati e numerati veri, citazioni, tabelle.
 *
 * Perche' non riusare /api/drive della v1: quella fa una danza in quattro passi
 * (crea documento vuoto -> inserisce testo grezzo -> rilegge il documento ->
 * applica gli stili dei titoli riconoscendo i "#" -> cancella i "#") e nel
 * farlo ELIMINA il grassetto e il corsivo con una replace commentata
 * "verra' riapplicato dopo", cosa che non avviene mai.
 *
 * Il risultato: nessun grassetto, elenchi ridotti a trattini letterali,
 * citazioni con il ">" in chiaro e ogni paragrafo in Normal text.
 * Qui basta una sola richiesta e non si perde nulla.
 */

const FETCH_TIMEOUT_MS = 20000;

async function fetchT(url, options = {}, timeout = FETCH_TIMEOUT_MS) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeout);
  try {
    return await fetch(url, { ...options, signal: ctrl.signal });
  } finally {
    clearTimeout(id);
  }
}

/**
 * Ripulisce il Markdown prima della conversione.
 *
 * Il convertitore di Google e' piu' severo di quelli permissivi: un titolo o un
 * elenco senza riga vuota prima viene assorbito nel paragrafo precedente e
 * resta testo normale con i "#" in chiaro.
 */
export function normalizzaMarkdown(md) {
  let out = String(md).replace(/\r\n?/g, '\n');

  // Riga vuota prima di ogni titolo
  out = out.replace(/([^\n])\n(#{1,6}\s)/g, '$1\n\n$2');
  // Riga vuota prima di un elenco che parte subito dopo un paragrafo
  out = out.replace(/([^\n\-*\d>\s])\n([-*]\s|\d+[.)]\s)/g, '$1\n\n$2');
  // Riga vuota prima di una citazione
  out = out.replace(/([^\n>])\n(>\s)/g, '$1\n\n$2');
  // Uno spazio dopo i cancelletti: "##Titolo" non e' un titolo valido
  out = out.replace(/^(#{1,6})([^#\s])/gm, '$1 $2');
  // Grassetto lasciato aperto: se in una riga i "**" sono in numero dispari,
  // l'ultimo non e' chiuso e il grassetto dilagherebbe sul resto del documento.
  // Va contato per riga: una regola "**...fine riga" chiuderebbe erroneamente
  // anche righe corrette come "- **Autore:** Mario".
  out = out
    .split('\n')
    .map((riga) => {
      const marcatori = (riga.match(/\*\*/g) || []).length;
      return marcatori % 2 === 1 ? riga + '**' : riga;
    })
    .join('\n');
  // Massimo una riga vuota consecutiva
  out = out.replace(/\n{3,}/g, '\n\n');

  return out.trim() + '\n';
}

/** Trova la cartella della categoria, o la crea */
async function cartellaCategoria(accessToken, radice, nome) {
  const q = [
    `name='${nome.replace(/'/g, "\\'")}'`,
    `'${radice}' in parents`,
    "mimeType='application/vnd.google-apps.folder'",
    'trashed=false'
  ].join(' and ');

  const cerca = await fetchT(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id)`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (cerca.ok) {
    const d = await cerca.json();
    if (d.files?.length) return d.files[0].id;
  }

  const crea = await fetchT('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: nome,
      parents: [radice],
      mimeType: 'application/vnd.google-apps.folder'
    })
  });
  if (!crea.ok) return radice; // ripiega sulla cartella principale
  return (await crea.json()).id;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { content, title, category, accessToken } = req.body || {};
    if (!content || !title || !accessToken) {
      return res.status(400).json({ error: 'content, title e accessToken sono richiesti' });
    }

    const radice = process.env.GOOGLE_DRIVE_FOLDER_ID;
    if (!radice) {
      return res.status(500).json({ error: 'GOOGLE_DRIVE_FOLDER_ID non configurato' });
    }

    const categoryName = (category || 'FORMAZIONE').toUpperCase();
    const cartella = await cartellaCategoria(accessToken, radice, categoryName);

    const markdown = normalizzaMarkdown(content);

    // Upload multipart: metadati + corpo Markdown in un'unica richiesta.
    // Il mimeType di destinazione chiede a Drive la conversione in Google Docs.
    const boundary = '----trascrittino2-' + categoryName.replace(/\W/g, '') + '-boundary';
    const corpo =
      `--${boundary}\r\n` +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify({
        name: title.slice(0, 200),
        parents: [cartella],
        mimeType: 'application/vnd.google-apps.document'
      }) +
      `\r\n--${boundary}\r\n` +
      'Content-Type: text/markdown; charset=UTF-8\r\n\r\n' +
      markdown +
      `\r\n--${boundary}--`;

    const up = await fetchT(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`
        },
        body: corpo
      },
      45000
    );

    if (!up.ok) {
      const e = await up.json().catch(() => ({}));
      return res.status(up.status).json({
        error: `Google Drive: ${e.error?.message || up.statusText}`
      });
    }

    const file = await up.json();

    return res.status(200).json({
      success: true,
      docId: file.id,
      docUrl: `https://docs.google.com/document/d/${file.id}/edit`,
      category: categoryName,
      categoryFolderId: cartella,
      // il documento e' Markdown convertito, non testo grezzo con i cancelletti
      formato: 'markdown-convertito'
    });
  } catch (error) {
    return res.status(500).json({
      error: error.name === 'AbortError' ? 'Timeout su Google Drive' : 'Errore su Google Drive',
      message: error.message
    });
  }
}
