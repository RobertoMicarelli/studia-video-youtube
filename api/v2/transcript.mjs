/**
 * Trascrittino 2.0 — /api/v2/transcript
 *
 * Restituisce metadati del video + TRASCRIZIONE REALE.
 *
 * La v1 chiamava l'endpoint /captions di YouTube Data API, ne scartava il
 * risultato e passava a GPT la DESCRIZIONE del video. Qui la trascrizione viene
 * estratta davvero, provando in cascata tre strategie; se nessuna funziona
 * l'endpoint lo dichiara esplicitamente (campo `source`) invece di far finta
 * di niente.
 *
 * Strategie, in ordine:
 *   1. InnerTube player API, client ANDROID  (la piu' affidabile da datacenter)
 *   2. InnerTube player API, client WEB
 *   3. Scraping della pagina /watch -> ytInitialPlayerResponse
 * Fallback dichiarato: descrizione del video.
 */

const INNERTUBE_KEY = 'AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8';
const UA_DESKTOP =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36';
const UA_ANDROID = 'com.google.android.youtube/19.09.37 (Linux; U; Android 14) gzip';

const FETCH_TIMEOUT_MS = 12000;

/** fetch con timeout, cosi' una strategia lenta non brucia il budget della funzione */
async function fetchT(url, options = {}, timeout = FETCH_TIMEOUT_MS) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeout);
  try {
    return await fetch(url, { ...options, signal: ctrl.signal });
  } finally {
    clearTimeout(id);
  }
}

/** ISO 8601 (PT1H2M3S) -> secondi */
function parseISODuration(iso) {
  const m = /^P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso || '');
  if (!m) return 0;
  const [, d, h, mi, s] = m.map((v) => (v ? parseInt(v, 10) : 0));
  return d * 86400 + h * 3600 + mi * 60 + s;
}

/** Sceglie la traccia migliore: prima l'italiano manuale, poi qualunque manuale, poi ASR */
function pickTrack(tracks) {
  if (!Array.isArray(tracks) || tracks.length === 0) return null;
  const manual = tracks.filter((t) => t.kind !== 'asr');
  const byLang = (list, lang) => list.find((t) => (t.languageCode || '').startsWith(lang));
  return (
    byLang(manual, 'it') ||
    byLang(tracks, 'it') ||
    byLang(manual, 'en') ||
    manual[0] ||
    byLang(tracks, 'en') ||
    tracks[0]
  );
}

/** Scarica una traccia sottotitoli e la trasforma in testo continuo */
async function downloadTrack(baseUrl) {
  if (!baseUrl) return '';
  const url = baseUrl.includes('fmt=') ? baseUrl : `${baseUrl}&fmt=json3`;

  const res = await fetchT(url, {
    headers: { 'User-Agent': UA_DESKTOP, 'Accept-Language': 'it,en;q=0.8' }
  });
  if (!res.ok) return '';

  const body = await res.text();
  if (!body.trim()) return '';

  // Formato json3
  if (body.trimStart().startsWith('{')) {
    let data;
    try {
      data = JSON.parse(body);
    } catch {
      return '';
    }
    const parts = (data.events || [])
      .flatMap((e) => (e.segs || []).map((s) => s.utf8 || ''))
      .join('');
    return normalize(parts);
  }

  // Fallback formato XML
  const chunks = [...body.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/g)].map((m) =>
    decodeEntities(m[1])
  );
  return normalize(chunks.join(' '));
}

function decodeEntities(s) {
  return s
    .replace(/&amp;#(\d+);/g, (_, d) => String.fromCharCode(d))
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(d))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function normalize(text) {
  return text
    .replace(/\[[^\]]{0,30}\]/g, ' ') // [Musica], [Applausi], ...
    .replace(/\s*\n\s*/g, ' ')
    .replace(/[ \t ]+/g, ' ')
    .trim();
}

/** Strategia 1 e 2: InnerTube player API */
async function viaInnerTube(videoId, client) {
  const isAndroid = client === 'ANDROID';
  const context = isAndroid
    ? { clientName: 'ANDROID', clientVersion: '19.09.37', androidSdkVersion: 34, hl: 'it', gl: 'IT' }
    : { clientName: 'WEB', clientVersion: '2.20240101.00.00', hl: 'it', gl: 'IT' };

  const res = await fetchT(`https://www.youtube.com/youtubei/v1/player?key=${INNERTUBE_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': isAndroid ? UA_ANDROID : UA_DESKTOP,
      'Accept-Language': 'it,en;q=0.8'
    },
    body: JSON.stringify({ context: { client: context }, videoId })
  });
  if (!res.ok) return null;

  const data = await res.json();
  return data?.captions?.playerCaptionsTracklistRenderer?.captionTracks || null;
}

/** Strategia 3: scraping della pagina watch */
async function viaWatchPage(videoId) {
  const res = await fetchT(`https://www.youtube.com/watch?v=${videoId}&hl=it`, {
    headers: { 'User-Agent': UA_DESKTOP, 'Accept-Language': 'it,en;q=0.8' }
  });
  if (!res.ok) return null;

  const html = await res.text();
  const marker = 'ytInitialPlayerResponse = ';
  const start = html.indexOf(marker);
  if (start === -1) return null;

  // Estrae l'oggetto JSON bilanciando le graffe (piu' robusto di una regex)
  let i = start + marker.length;
  let depth = 0;
  let inStr = false;
  let esc = false;
  const from = i;
  for (; i < html.length; i++) {
    const ch = html[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === '\\') esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === '{') depth++;
    else if (ch === '}' && --depth === 0) {
      i++;
      break;
    }
  }
  try {
    const data = JSON.parse(html.slice(from, i));
    return data?.captions?.playerCaptionsTracklistRenderer?.captionTracks || null;
  } catch {
    return null;
  }
}

/**
 * Provider esterno (opzionale, si attiva impostando SUPADATA_API_KEY su Vercel).
 *
 * Perche' serve: da meta' 2025 YouTube protegge l'endpoint `timedtext` con un
 * token "proof of origin" generato da BotGuard nel browser. Senza quel token
 * l'endpoint risponde HTTP 200 con corpo VUOTO a qualunque richiesta fatta da
 * un server, indipendentemente da cookie, visitorData, referer o client
 * InnerTube usato. Verificato empiricamente su piu' varianti.
 *
 * Di conseguenza le strategie gratuite qui sotto oggi non producono testo.
 * Restano attive perche' non costano nulla e tornerebbero utili se YouTube
 * allentasse il vincolo; ma per avere trascrizioni affidabili serve un
 * provider che gestisca il token al posto nostro.
 *
 * Per attivarlo: Vercel > Settings > Environment Variables > SUPADATA_API_KEY
 * Per sostituirlo con un altro servizio basta riscrivere questa funzione.
 */
async function viaProvider(videoId) {
  const key = process.env.SUPADATA_API_KEY;
  if (!key) return null;

  const res = await fetchT(
    `https://api.supadata.ai/v1/transcript?url=${encodeURIComponent(
      'https://www.youtube.com/watch?v=' + videoId
    )}&text=true`,
    { headers: { 'x-api-key': key } },
    20000
  );
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`provider HTTP ${res.status} ${detail.slice(0, 120)}`);
  }

  const data = await res.json();
  // Tollerante sulla forma della risposta: stringa, array di segmenti o campo testo
  const raw =
    typeof data.content === 'string'
      ? data.content
      : Array.isArray(data.content)
        ? data.content.map((c) => c.text || '').join(' ')
        : data.transcript || data.text || '';

  return {
    text: normalize(raw),
    language: data.lang || data.language || 'sconosciuta',
    autoGenerated: data.availableLangs ? null : null
  };
}

async function extractTranscript(videoId) {
  const attemptsPre = [];

  // Il provider ha la precedenza: e' l'unico che oggi restituisce testo davvero.
  if (process.env.SUPADATA_API_KEY) {
    try {
      const p = await viaProvider(videoId);
      if (p?.text && p.text.length > 200) {
        return {
          transcript: p.text,
          source: 'provider',
          language: p.language,
          autoGenerated: p.autoGenerated,
          attempts: attemptsPre
        };
      }
      attemptsPre.push('provider: risposta vuota');
    } catch (err) {
      attemptsPre.push(`provider: ${err.name === 'AbortError' ? 'timeout' : err.message}`);
    }
  } else {
    attemptsPre.push('provider: non configurato (SUPADATA_API_KEY assente)');
  }

  const strategies = [
    ['innertube-android', () => viaInnerTube(videoId, 'ANDROID')],
    ['innertube-web', () => viaInnerTube(videoId, 'WEB')],
    ['watch-page', () => viaWatchPage(videoId)]
  ];

  const attempts = attemptsPre;
  for (const [name, run] of strategies) {
    try {
      const tracks = await run();
      if (!tracks || tracks.length === 0) {
        attempts.push(`${name}: nessuna traccia`);
        continue;
      }
      const track = pickTrack(tracks);
      const text = await downloadTrack(track?.baseUrl);
      if (text && text.length > 200) {
        return {
          transcript: text,
          source: name,
          language: track?.languageCode || 'sconosciuta',
          autoGenerated: track?.kind === 'asr',
          attempts
        };
      }
      attempts.push(`${name}: traccia trovata ma testo vuoto/troppo corto`);
    } catch (err) {
      attempts.push(`${name}: ${err.name === 'AbortError' ? 'timeout' : err.message}`);
    }
  }
  return { transcript: '', source: null, attempts };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { videoId } = req.body || {};
  if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    return res.status(400).json({ error: 'Video ID mancante o non valido' });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'YOUTUBE_API_KEY non configurata su Vercel' });
  }

  try {
    // --- Metadati (YouTube Data API v3) ---
    const metaRes = await fetchT(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet,contentDetails`
    );
    if (!metaRes.ok) {
      const e = await metaRes.json().catch(() => ({}));
      return res.status(metaRes.status).json({
        error: `YouTube API: ${e.error?.message || metaRes.statusText}`
      });
    }
    const metaData = await metaRes.json();
    if (!metaData.items?.length) {
      return res.status(404).json({ error: 'Video non trovato o non pubblico' });
    }

    const v = metaData.items[0];
    const durationSec = parseISODuration(v.contentDetails?.duration);

    // Limite 4 ore, ora verificato sulla DURATA REALE e non stimato dai caratteri
    if (durationSec > 4 * 3600) {
      const ore = (durationSec / 3600).toFixed(1);
      return res.status(400).json({
        error: `Video troppo lungo: ${ore} ore. Il limite massimo e' 4 ore.`,
        durationSec
      });
    }

    const tags = v.snippet.tags || [];
    const temiTrattati = tags
      .slice(0, 7)
      .map((t) => '#' + t.replace(/[^a-zA-Z0-9À-ÿ\s]/g, '').replace(/\s+/g, '').substring(0, 30))
      .filter((t) => t.length > 1)
      .join(' ');

    // --- Trascrizione ---
    const { transcript, source, language, autoGenerated, attempts } =
      await extractTranscript(videoId);

    const description = v.snippet.description || '';
    const hasRealTranscript = Boolean(transcript);

    return res.status(200).json({
      success: true,
      videoId,
      title: v.snippet.title,
      author: v.snippet.channelTitle,
      publishedAt: v.snippet.publishedAt,
      durationSec,
      tags,
      temiTrattati,
      description,
      transcript: hasRealTranscript ? transcript : description,
      transcriptChars: (hasRealTranscript ? transcript : description).length,
      // Campi di trasparenza: il frontend li usa per avvisare l'utente
      source: hasRealTranscript ? source : 'descrizione-video',
      hasRealTranscript,
      language: language || null,
      autoGenerated: autoGenerated ?? null,
      attempts
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Errore durante il recupero del video',
      message: error.message
    });
  }
}
