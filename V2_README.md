# Trascrittino 2.0

Versione affiancata alla v1. **La v1 non è stata sostituita**: continua a vivere su `/`, la 2.0 sta su `/v2`.

---

## Cosa c'era che non andava

### 1. Il codice su `main` non era eseguibile

Il commit `9cde33d` ("Fix CRITICO: Previene chiamate multiple simultanee") ha aperto un `try {` in `startProcessing()` senza chiuderlo con `catch`/`finally`. Risultato:

```
SyntaxError: Missing catch or finally after try
```

Un errore di sintassi impedisce il **parsing dell'intero script inline**: con quel codice online non funzionava niente, nemmeno il login. I 5 commit successivi hanno ereditato l'errore.

Il sito era salvo solo perché il deploy Vercel era fermo a `6a28e7d`, sette commit indietro. Il progetto in `.vercel/project.json` (`studia-da-video-youtube`) risponde 404: il dominio vivo `studia-video-youtube.vercel.app` appartiene a un altro progetto, che non riceve più i push.

**→ Corretto in v1** con il `finally` mancante, che rilascia anche `isProcessing` sui `return` anticipati.

### 2. Le dispense non nascevano dalle trascrizioni

`api/youtube.js` chiamava l'endpoint `/captions`, ne scartava il risultato e passava a GPT la **descrizione** del video:

```javascript
if (captionsResponse.ok) {
    transcript = description; // Fallback alla descrizione
}
```

Il prompt chiedeva di sviluppare "3-4 volte la lunghezza della trascrizione" su un testo che trascrizione non era.

### 3. Timeout serverless

Nessun `maxDuration` configurato. Una singola chiamata OpenAI per l'intero video veniva troncata dal runtime → 504 sui contenuti lunghi. Il frontend aspettava 5 minuti un risultato che Vercel aveva già ucciso.

---

## Cosa fa la 2.0

### Architettura a segmenti (obbligatoria su piano Hobby)

Il limite è 60 secondi per funzione. Invece di una chiamata monolitica:

```
trascrizione → segmenti da 12k caratteri
             → /api/v2/dispensa (2 in parallelo, ognuna < 60s)
             → riassemblaggio in ordine
             → /api/v2/dispensa mode=abstract
             → documento finale
```

Con un solo segmento il prompt inviato è **identico a quello della v1**, quindi per i video corti l'output non cambia. Oltre il segmento singolo entra in gioco un wrapper che dice al modello quale porzione sta scrivendo e cosa omettere.

### Criterio: leggibilità, non lunghezza

La v1 chiedeva una dispensa "3-4 volte la lunghezza della trascrizione" e nello stesso prompt vietava di inventare contenuti. Due richieste incompatibili: il modello risolveva la tensione **allungando con parafrasi**.

Le direttive sul volume sono state riscritte in direttive di leggibilità, e a ogni prompt viene accodato `CANONE_LEGGIBILITA` (in coda, perché i vincoli finali pesano più di quelli iniziali): densità e non volume, frasi brevi, un'idea per paragrafo, titoli che dicono il contenuto, grassetto solo sui concetti chiave, niente frasi di raccordo vuote.

Effetto misurato sullo stesso video di 19 minuti:

| | Prima | Dopo |
|---|---|---|
| Lunghezza | 54.057 car. (30 pagine) | **24.504 car. (14 pagine)** |
| Rapporto sulla trascrizione | 2,93× | 1,33× |
| Segmenti troncati | 2/3 | **0/3** |
| Token in output | 14.958 | **6.042** |
| Frase media | — | 136 caratteri |
| Paragrafo medio | — | 284 caratteri (~3-4 righe) |
| Tempo | 66s | **40s** |

Più corta, più densa, più economica e più veloce. I titoli sono descrittivi ("Perché riconoscere un numero è facile per il cervello e difficile per un programma") invece di etichette generiche.

### Il documento è Markdown convertito, non testo con i cancelletti

Il percorso della v1 (`/api/drive`) crea un documento vuoto, inserisce testo grezzo, lo rilegge, applica gli stili riconoscendo i `#` e poi li cancella. Nel farlo **elimina grassetto e corsivo**:

```javascript
.replace(/\*\*(.+?)\*\*/g, '$1')  // "verrà riapplicato dopo"  ← mai
```

Risultato: nessun grassetto, elenchi ridotti a trattini letterali, citazioni col `>` in chiaro, tutto in Normal text.

`/api/v2/drive` carica invece il documento come `text/markdown` e lascia convertire Drive: **titoli navigabili dal pannello struttura**, grassetto, elenchi puntati e numerati veri, citazioni. Una sola richiesta invece di quattro. `/api/drive` resta intatto per la v1.

C'è anche `normalizzaMarkdown`, perché il convertitore di Google è severo: un titolo senza riga vuota prima viene assorbito nel paragrafo e resta testo normale coi cancelletti a vista.

### L'abstract lo produce il backend

La v1 aveva ~250 righe di regex che frugavano nell'output di GPT sperando di ritrovare l'ABSTRACT, con quattro varianti per categoria e tre livelli di fallback. Sono sparite: una chiamata corta e dedicata restituisce il testo, il frontend lo usa così com'è per email e registro.

### Altri fix

| Problema v1 | 2.0 |
|---|---|
| `isProcessing` mai rilasciato sui return anticipati → bottone morto fino a F5 | stato rilasciato in `finally`, sempre |
| `refreshTokenIfNeeded()` definita due volte, la prima morta | una sola implementazione |
| throttle che accumulava `setTimeout` (`pendingUpdate` ricreato senza `.timeout`) | rimosso: il progresso segue i segmenti reali |
| `alert()` bloccanti | banner inline con `aria-live` |
| nessun modo di fermare un'elaborazione | pulsante Annulla con `AbortController` |
| email/sheet in serie: se l'email falliva si perdeva il resto | `Promise.allSettled`, esito riportato singolarmente |
| password in chiaro nel sorgente, con commento esplicativo | solo hash SHA-256 (vedi nota sotto) |
| logo PNG da 1 MB | 65 KB, con `width`/`height` per evitare layout shift |
| Tailwind CDN (~300 KB, JIT a runtime) per poche classi | rimosso: CSS scritto a mano, zero JS di terze parti |
| 4 template di prompt spediti al browser a ogni caricamento | spostati sul server |
| griglie `repeat(3, 1fr)` fisse | `auto-fit` + `minmax`, nessun overflow orizzontale a 375px |
| font `Syne` usato ma non caricato | caricato |

### Grafica

Palette AI-utati confermata — arancione `#F3832C` (umano), teal `#0094B5` (AI) — ma usata come **accento**, non come colore del testo. Nella v1 quasi ogni paragrafo era arancione o teal: leggibile sì, ma senza gerarchia e faticoso da leggere. Ora il testo vive sui neutri e il brand marca CTA, stati e titoli.

In più: tema chiaro/scuro con toggle, focus visibile ovunque, rispetto di `prefers-reduced-motion`, scala tipografica fluida.

> Sul contrasto: nella diagnosi iniziale avevo indicato `#0094B5` su `#1a1a2e` come sotto WCAG AA. Rifatto il calcolo, è 4.77:1 — **passa**. Il problema era di gerarchia e leggibilità, non di conformità.

---

## ⚠️ Trascrizioni: serve una decisione

**La strada gratuita non funziona più.** Da metà 2025 YouTube protegge `timedtext` con un token *proof-of-origin* generato da BotGuard nel browser. Senza, l'endpoint risponde `HTTP 200` con **corpo vuoto** a qualunque richiesta server-side.

Verificato empiricamente:

| Tentativo | Esito |
|---|---|
| InnerTube client `ANDROID` | nessuna traccia |
| InnerTube client `WEB` | nessuna traccia |
| InnerTube `ANDROID_VR` | `LOGIN_REQUIRED` |
| InnerTube `IOS` / `MWEB` / `TVHTML5` / `WEB_EMBEDDED` | `ERROR` / `UNPLAYABLE` / nessuna traccia |
| Scraping `ytInitialPlayerResponse` | **31 tracce trovate**, download → `200`, `0 byte` |
| + cookie di sessione, `X-Goog-Visitor-Id`, `Referer`, `Origin`, `&c=WEB`, `&potc=1` | `200`, `0 byte` in tutte le 12 combinazioni |

Le strategie gratuite restano nel codice: non costano nulla e tornerebbero utili se YouTube allentasse il vincolo. Ma oggi non producono testo.

### Per sbloccarle

Il codice ha già l'innesto pronto. Servono tre passaggi:

1. Registrati su **[supadata.ai](https://supadata.ai)** — piano gratuito da 100 richieste/mese
2. Copia la API key dalla loro dashboard
3. Su Vercel: progetto `studia-video-youtube` → **Settings → Environment Variables → Add New**
   - Name: `SUPADATA_API_KEY`
   - Value: la chiave
   - Environments: Production, Preview, Development

Oppure da terminale:

```bash
npx vercel env add SUPADATA_API_KEY production
```

**Poi serve un redeploy:** le variabili nuove entrano in vigore solo al deploy successivo.

Per usare un altro servizio basta riscrivere `viaProvider()` in [api/v2/transcript.mjs](api/v2/transcript.mjs) — una funzione, una ventina di righe.

**Senza quella chiave la 2.0 ripiega sulla descrizione, esattamente come la v1** — con la differenza che te lo dice: banner giallo durante l'elaborazione e campo "Fonte testo" nel risultato finale.

---

## File

```
NUOVI
  v2/index.html            frontend
  v2/assets/logo-256.png   logo ottimizzato (1 MB → 65 KB)
  api/v2/transcript.mjs    metadati + trascrizione + adapter provider
  api/v2/dispensa.mjs      elaborazione a segmenti + abstract
  lib/prompts.mjs          i 4 template, verbatim dalla v1, + wrapper segmenti

MODIFICATI
  vercel.json              aggiunto maxDuration 60s su api/v2/* (v1 non toccata)
  studia-video-youtube.html  solo il finally mancante, per rendere main deployabile

INVARIATI
  api/auth.js  api/drive.js  api/gmail.js  api/sheets.js  api/folders.js
  (la 2.0 li riusa così come sono)
```

Funzioni serverless totali: 9 su 12 disponibili nel piano Hobby.

---

## Prima di mettere online

1. **Ricollegare il deploy.** `.vercel/project.json` punta a un progetto che non esiste. Da rifare: `vercel link` sul progetto giusto, oppure ricollegare il repo GitHub dalla dashboard del progetto `studia-video-youtube`.
2. **Verificare il redirect OAuth.** `GOOGLE_REDIRECT_URI` deve corrispondere a quanto registrato in Google Cloud Console. La 2.0 riusa `/api/auth`, quindi il redirect esistente va bene; il ritorno atterra su `/` — per finire su `/v2` serve aggiornare l'URI in entrambi i posti.
3. **Decidere su `SUPADATA_API_KEY`** (vedi sopra).
4. **Testare `/v2` prima di spostare `/`.** La v1 resta intatta come rete di sicurezza.

### Protezione dell'accesso

Il gate di `/v2` non spedisce più la password in chiaro, ma resta lato client: chiunque legga il sorgente vede la struttura e può saltarlo dal `sessionStorage`. **Non è sicurezza, è un paravento.**

Per una protezione vera: *Vercel → Settings → Deployment Protection → Password Protection* (richiede piano Pro).

Nota separata: il token `autoAuth` usato dalle altre app codifica `username:password` in Base64 invertito. Chi ha uno di quei link ha di fatto la password. La 2.0 mantiene la compatibilità (confronta l'hash, così il valore non è più ricavabile dal sorgente), ma il meccanismo andrebbe ripensato.

### Variabili d'ambiente

Già configurate — invariate:
`OPENAI_API_KEY` · `YOUTUBE_API_KEY` · `GOOGLE_CLIENT_ID` · `GOOGLE_CLIENT_SECRET` · `GOOGLE_REDIRECT_URI` · `GOOGLE_DRIVE_FOLDER_ID` · `GOOGLE_SHEETS_ID` · `NOTIFICATION_EMAIL`

Nuove, tutte opzionali:

| Variabile | Default | A cosa serve |
|---|---|---|
| `SUPADATA_API_KEY` | — | sblocca le trascrizioni reali |
| `OPENAI_MODEL_V2` | `gpt-5.4-mini` | modello per i segmenti — **vedi avvertenza sotto** |
| `OPENAI_MAX_TOKENS_SECTION` | `4000` | lunghezza massima per segmento; abbassala se vedi timeout |
| `OPENAI_MODEL_ABSTRACT` | `gpt-4o-mini` | modello per la chiamata corta dell'abstract |

`OPENAI_MODEL` (che vale `gpt-5.2`) resta usata **solo dalla v1**: la 2.0 la ignora di proposito, così le due versioni non si trascinano a vicenda.

### ⚠️ Prima di cambiare il modello dei segmenti

Benchmark reale sullo stesso task, 4000 `max_completion_tokens`:

| Modello | tok/s | Token di ragionamento | Esito |
|---|---|---|---|
| **gpt-5.4-mini** | **157** | 0 | ✅ scelto |
| gpt-4.1 | 148 | 0 | ok, ma scrive meno |
| gpt-5.2-chat-latest | 96 | 0 | al limite |
| gpt-5.2 *(quello della v1)* | 61 | 0 | ❌ timeout |
| gpt-5.6-sol | 62 | 4000 | ❌ **contenuto vuoto** |
| gpt-5.5 | 55 | 4000 | ❌ **contenuto vuoto** |

I due modelli più recenti spendono l'intero budget in ragionamento e restituiscono testo vuoto **senza alcun errore HTTP**. Scegliere "il più recente" a occhio produce dispense vuote.

Se cambi modello, misura sempre `usage.completion_tokens_details.reasoning_tokens` prima di metterlo in produzione. Il codice ha comunque una guardia che segnala il caso invece di fallire in silenzio.

Con `gpt-5.4-mini`, un segmento reale da 12k caratteri gira in **~20s** contro i 60 disponibili.

---

## Verifiche eseguite

- `node --check` su tutti i moduli e sugli script inline di v1 e v2 → nessun errore
- endpoint trascrizione su 3 video reali → metadati e durata corretti, fonte dichiarata correttamente
- pipeline a 2 segmenti + abstract con chiamate OpenAI reali → 7 verifiche su 7:
  nessun errore HTTP · nessun blocco METADATI duplicato · nessun ABSTRACT duplicato ·
  continuità fra segmenti · sezioni conclusive solo nell'ultimo · abstract entro i limiti · outline valido
- resa a 375px → nessun overflow orizzontale
- console del browser → nessun errore

**Non testato:** il percorso Drive / Gmail / Sheets della 2.0, perché richiede un login Google interattivo. Il codice riusa gli endpoint v1 invariati con gli stessi payload, ma la conferma sul campo la darà il primo run reale.
