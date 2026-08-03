/**
 * Trascrittino 2.0 — /api/v2/dispensa
 *
 * Elabora UN segmento alla volta invece dell'intera trascrizione in un colpo solo.
 * Motivo: su Vercel Hobby una funzione ha 60 secondi di budget. La v1 faceva una
 * sola chiamata OpenAI per tutto il video e sui contenuti lunghi veniva uccisa dal
 * runtime -> 504. Qui il frontend spezza la trascrizione e chiama questo endpoint
 * piu' volte, ogni chiamata resta ampiamente sotto il limite.
 *
 * Modalita':
 *   mode: 'section'   -> elabora il segmento index/total e restituisce la sua porzione
 *   mode: 'abstract'  -> genera abstract/presentazione partendo dall'indice del documento
 *
 * Nessuna API key esce mai dal backend.
 */

import {
  selectKind,
  buildSegmentPrompt,
  buildAbstractPrompt,
  buildClosingPrompt
} from '../../lib/prompts.mjs';

// maxDuration e' dichiarato in vercel.json (functions: "api/v2/*.mjs")

// Margine di sicurezza: rispondiamo prima che il runtime tagli la connessione,
// cosi' il client riceve un errore leggibile invece di un 504 muto.
const HARD_DEADLINE_MS = 52000;
const MAX_RETRIES = 2;

const isNewGen = (m) => /^(gpt-5|o1|o3|o4)/.test(m || '');

function buildBody({ model, prompt, system, maxTokens, temperature }) {
  const body = {
    model,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: prompt }
    ]
  };
  if (isNewGen(model)) {
    // I modelli di nuova generazione usano max_completion_tokens e temperatura fissa
    body.max_completion_tokens = maxTokens;
  } else {
    body.max_tokens = maxTokens;
    body.temperature = temperature;
  }
  return body;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Rete di sicurezza per l'elaborazione a segmenti.
 *
 * Anche istruito a non farlo, il modello ogni tanto riapre un segmento con il
 * blocco METADATI o con un ABSTRACT, perche' la struttura descritta nel template
 * glielo chiede. Il blocco corretto viene composto una sola volta dal frontend,
 * quindi qui togliamo i duplicati in testa invece di lasciarli nel documento.
 */
function stripLeadingHeader(text) {
  let out = text.trimStart();

  const metadati =
    /^(?:#{1,4}\s*)?(?:\d+[.)]\s*)?METADATI DEL VIDEO\b[\s\S]*?(?:^\s*(?:[-*]\s*)?(?:\*\*)?Data di elaborazione(?:\*\*)?\s*:?[^\n]*\n|(?=^\s*#{1,4}\s))/im;
  if (metadati.test(out)) out = out.replace(metadati, '').trimStart();

  // Righe di metadati sparse rimaste in testa (Autore:, Titolo:, URL YouTube: …)
  const metaLine =
    /^(?:[-*]\s*)?(?:\*\*)?(?:Autore|Titolo|URL YouTube|Temi Trattati|Data di elaborazione)(?:\*\*)?\s*:[^\n]*\n?/i;
  while (metaLine.test(out)) out = out.replace(metaLine, '').trimStart();

  // Sezione di apertura duplicata
  const apertura =
    /^(?:#{1,4}\s*)?(?:\d+[.)]\s*)?(?:\[?SEZIONE_PRESENTAZIONE\]?|ABSTRACT(?: INIZIALE)?|METADATA)\b[^\n]*\n+/i;
  if (apertura.test(out)) out = out.replace(apertura, '').trimStart();

  return out;
}

async function callOpenAI({ apiKey, body, deadline }) {
  let lastError;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const remaining = deadline - Date.now();
    if (remaining < 4000) {
      throw new Error(
        lastError
          ? `OpenAI non ha risposto in tempo (${lastError})`
          : 'Tempo esaurito prima di poter contattare OpenAI'
      );
    }

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), remaining - 1500);

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(body),
        signal: ctrl.signal
      });
      clearTimeout(timer);

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;

        if (!text) {
          // I modelli di reasoning possono consumare l'INTERO budget di token in
          // ragionamento e restituire contenuto vuoto senza alcun errore HTTP.
          // Verificato: gpt-5.5 e gpt-5.6-sol lo fanno su questo task.
          const ragionamento = data.usage?.completion_tokens_details?.reasoning_tokens || 0;
          throw new Error(
            ragionamento > 0
              ? `Il modello "${body.model}" ha speso tutti i ${ragionamento} token disponibili in ragionamento, senza produrre testo. Usa un modello senza reasoning (es. gpt-5.4-mini) impostando OPENAI_MODEL_V2, oppure alza OPENAI_MAX_TOKENS_SECTION.`
              : 'Risposta OpenAI vuota'
          );
        }

        return {
          text,
          finishReason: data.choices[0].finish_reason,
          usage: data.usage || null
        };
      }

      const err = await res.json().catch(() => ({}));
      const msg = err.error?.message || res.statusText;

      // 429 e 5xx sono transitori: riprova con backoff. Il resto e' definitivo.
      if (res.status === 429 || res.status >= 500) {
        lastError = `${res.status} ${msg}`;
        if (attempt < MAX_RETRIES) {
          await sleep(Math.min(1500 * 2 ** attempt, 6000));
          continue;
        }
      }
      const e = new Error(`OpenAI: ${msg}`);
      e.status = res.status;
      throw e;
    } catch (err) {
      clearTimeout(timer);
      if (err.name === 'AbortError') {
        throw new Error(
          'Timeout: OpenAI ha impiegato troppo su questo segmento. Riprova, oppure abbassa OPENAI_MAX_TOKENS_SECTION.'
        );
      }
      if (err.status) throw err;
      lastError = err.message;
      if (attempt >= MAX_RETRIES) throw err;
      await sleep(Math.min(1500 * 2 ** attempt, 6000));
    }
  }
  throw new Error(lastError || 'Errore sconosciuto');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const deadline = Date.now() + HARD_DEADLINE_MS;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY non configurata su Vercel' });
  }

  try {
    const {
      mode = 'section',
      category,
      meta = {},
      transcript = '',
      outline = '',
      index = 0,
      total = 1
    } = req.body || {};

    const kind = selectKind(category);
    const temperature = parseFloat(process.env.OPENAI_TEMPERATURE || '0.7');

    // ---------------- abstract ----------------
    if (mode === 'abstract') {
      if (!outline.trim()) {
        return res.status(400).json({ error: 'outline richiesto per mode=abstract' });
      }
      const model = process.env.OPENAI_MODEL_ABSTRACT || 'gpt-4o-mini';
      const { text, usage } = await callOpenAI({
        apiKey,
        deadline,
        body: buildBody({
          model,
          system: 'Sei un redattore didattico. Rispondi solo con il testo richiesto.',
          prompt: buildAbstractPrompt({ kind, meta, outline: outline.slice(0, 12000) }),
          maxTokens: 700,
          temperature
        })
      });
      return res.status(200).json({
        success: true,
        mode: 'abstract',
        kind,
        text: text.trim(),
        usage
      });
    }

    // ---------------- closing ----------------
    if (mode === 'closing') {
      if (!outline.trim()) {
        return res.status(400).json({ error: 'outline richiesto per mode=closing' });
      }
      const model = process.env.OPENAI_MODEL_V2 || 'gpt-5.4-mini';
      const { text, usage } = await callOpenAI({
        apiKey,
        deadline,
        body: buildBody({
          model,
          system: 'Sei un redattore didattico. Rispondi solo con le sezioni richieste.',
          prompt: buildClosingPrompt({ kind, meta, corpo: outline.slice(0, 40000) }),
          maxTokens: 2500,
          temperature
        })
      });
      return res.status(200).json({
        success: true,
        mode: 'closing',
        kind,
        text: text.trim(),
        usage
      });
    }

    // ---------------- section ----------------
    if (!transcript.trim()) {
      return res.status(400).json({ error: 'transcript richiesto per mode=section' });
    }
    if (transcript.length > 60000) {
      return res.status(400).json({
        error: 'Segmento troppo grande: il frontend deve spezzare la trascrizione.'
      });
    }

    // Variabile dedicata alla 2.0: OPENAI_MODEL vale gpt-5.2 ed e' condivisa con la
    // v1, ma su questo task gpt-5.2 sta a ~61 tok/s e sfonda il budget di 60s.
    //
    // gpt-5.4-mini misurato a ~157 tok/s, 2,6x piu' veloce, senza token di
    // ragionamento. ATTENZIONE prima di cambiarlo: gpt-5.5 e gpt-5.6-sol
    // consumano l'intero budget in ragionamento e restituiscono contenuto VUOTO.
    // Misura sempre reasoning_tokens prima di adottare un modello qui.
    const model = process.env.OPENAI_MODEL_V2 || 'gpt-5.4-mini';
    // 5500 token a ~157 tok/s = ~35s, dentro il budget di 52s.
    // Con 4000 i segmenti venivano troncati sistematicamente (misurato 2/2).
    const maxTokens = parseInt(process.env.OPENAI_MAX_TOKENS_SECTION || '5500', 10);

    const { text, finishReason, usage } = await callOpenAI({
      apiKey,
      deadline,
      body: buildBody({
        model,
        system:
          'Sei un assistente esperto nella creazione di dispense didattiche professionali da trascrizioni video.',
        prompt: buildSegmentPrompt({ kind, meta, transcript, index, total }),
        maxTokens,
        temperature
      })
    });

    return res.status(200).json({
      success: true,
      mode: 'section',
      kind,
      index,
      total,
      // Con un solo segmento l'output e' il documento completo della v1 e va
      // lasciato intatto; a piu' segmenti si ripuliscono le intestazioni doppie.
      text: total > 1 ? stripLeadingHeader(text) : text,
      truncated: finishReason === 'length',
      usage
    });
  } catch (error) {
    const status = error.status && error.status >= 400 && error.status < 600 ? error.status : 500;
    return res.status(status).json({
      error: error.message || 'Errore durante l\'elaborazione',
      segment: req.body?.index ?? null
    });
  }
}
