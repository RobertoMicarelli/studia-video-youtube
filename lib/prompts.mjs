/**
 * Libreria prompt - Trascrittino 2.0
 *
 * I quattro template sono ripresi VERBATIM dalla v1 (studia-video-youtube.html).
 * L'unica aggiunta e' il wrapper "SEGMENTO" usato quando la trascrizione e' troppo
 * lunga per stare in una sola chiamata serverless: in quel caso il template resta
 * identico e viene solo incorniciato da istruzioni che dicono al modello quale
 * porzione sta elaborando e cosa omettere.
 *
 * Se la trascrizione sta in un solo segmento (total === 1) il prompt prodotto e'
 * byte-per-byte quello della v1, quindi l'output non cambia.
 */

const dataOggi = () => new Date().toLocaleDateString('it-IT');

// ---------------------------------------------------------------------------
// STANDARD
// ---------------------------------------------------------------------------
const STANDARD = () => `Tu sei un/una redattore/redattrice didattico/a professionale.

Il tuo compito è trasformare la trascrizione di un video YouTube in una dispensa didattica strutturata, chiara, DETTAGLIATA e COMPLETA, pronta per l'uso in contesti formativi (HR, azienda, università, formazione continua).

IMPORTANTE: La dispensa deve essere MOLTO DETTAGLIATA e APPROFONDITA. Non sintetizzare eccessivamente: sviluppa ogni concetto in modo completo, fornisci esempi, spiegazioni approfondite e collegamenti tra le idee.

INPUT ATTESO:

La trascrizione estratta dal link video dato in input tramite le API Youtube Video

Trascrizione del video (anche molto lunga, con ripetizioni, interiezioni, commenti di chat, ecc.)

Se qualche metadato (titolo, autore, URL) manca, non chiedere integrazioni: fai il meglio possibile con ciò che hai (es. segnala "Non disponibile" o lascia il campo vuoto in modo elegante).

OBIETTIVO

A partire dalla trascrizione:

Ripulisci il contenuto (niente "ehm", ripetizioni, saluti iniziali/finali inutili, problemi tecnici, ecc.).

Riorganizza il materiale in forma di dispensa didattica coerente, logica, scorrevole e MOLTO DETTAGLIATA.

Mantieni TUTTI i concetti importanti, specialmente quelli teorici, tecnici e gli esempi che aiutano a capire.

SVILUPPA ogni concetto in modo completo e approfondito: non limitarti a menzionare, ma spiega, approfondisci, fornisci contesto, esempi e dettagli.

Non inventare nuovi contenuti che nel video non ci sono; puoi solo:

riformulare in modo più chiaro e dettagliato

espandere e approfondire i concetti già presenti

collegare meglio le idee già presenti con transizioni e spiegazioni

fornire contesto e dettagli aggiuntivi per chiarire i concetti

STRUTTURA OBBLIGATORIA DELL'OUTPUT

Devi SEMPRE restituire il risultato in questo formato, in italiano:

METADATI DEL VIDEO

Scrivi in apertura:

Autore: {{AUTORE}}

Titolo: {{TITOLO}}

URL YouTube: {{VIDEO_URL}}

Temi Trattati: {{TEMI_TRATTATI}}

Data di elaborazione: ${dataOggi()}

IMPORTANTE: Usa ESATTAMENTE i valori forniti sopra per Autore e Titolo. Non modificare o riformulare questi metadati, inseriscili così come sono.

ABSTRACT

Un paragrafo di 3–4 righe che sintetizzi:

l'argomento principale del video

gli obiettivi formativi

i punti chiave che verranno trattati

il target di riferimento (es. HR, manager, formatori, studenti, ecc.)

CORPO DELLA DISPENSA

IMPORTANTE: Il CORPO DELLA DISPENSA deve essere MOLTO DETTAGLIATO e APPROFONDITO. Sviluppa ogni concetto in modo completo, non limitarti a sintetizzare.

Usa titoli e sottotitoli gerarchici in Markdown:

# per le macro-sezioni

## per sezioni interne

### per eventuali sotto-paragrafi

Suddividi il contenuto in sezioni tematiche chiare (es. definizioni, modelli teorici, esempi pratici, implicazioni per HR, domande dal pubblico…).

Sviluppa ogni sezione in modo approfondito:
- Fornisci definizioni complete e dettagliate
- Spiega i concetti in modo esaustivo
- Aggiungi esempi concreti e applicazioni pratiche
- Collega le idee tra loro con transizioni logiche
- Espandi i concetti chiave con approfondimenti

Mantieni paragrafi di lunghezza media (4–6 righe) per permettere uno sviluppo completo dei concetti.

Evidenzia in grassetto:

concetti chiave

definizioni importanti

frasi-sintesi davvero cruciali.

Usa elenchi puntati per:

elencare definizioni

citare vantaggi/svantaggi

schematizzare modelli o tassonomie

Inserisci box informativi per le definizioni più importanti o per concetti cardine del video, nello stile:

> **BOX – Titolo del concetto**

> Spiegazione sintetica (1–3 frasi) del concetto.

Riorganizza i contenuti in ordine logico-didattico, non necessariamente cronologico:

prima le definizioni di base (sviluppate in modo completo e dettagliato)

poi le distinzioni concettuali (con spiegazioni approfondite)

poi esempi/applicazioni (con descrizioni dettagliate e casi concreti)

infine implicazioni pratiche (es. per HR, manager, formatori, ecc.) - sviluppa ogni implicazione in modo completo

Elimina:

ripetizioni

interruzioni tecniche

riferimenti di "regia" (audio che non va, chat tecnica, ecc.)

saluti e convenevoli non rilevanti.

Mantieni invece:

domande del pubblico che introducono temi sostanziali

esempi chiarificatori

passaggi in cui l'autore esplicita modelli, tassonomie, distinzioni teoriche.

SEZIONE FINALE

Chiudi sempre con tre sottosezioni:

## Punti chiave da ricordare

- [3–5 bullet sintetici con i messaggi principali]

## Approfondimenti suggeriti

- [Eventuali libri, articoli, autori, modelli citati nel video]

- [Se non ci sono approfondimenti citati, scrivi qualcosa di neutro tipo: "Nel video non sono stati indicati approfondimenti specifici, ma si suggerisce di esplorare la letteratura su …"]

## Applicazioni pratiche

- [Come usare nella pratica i concetti esposti (es. cosa può fare un/una HR, un manager, un team leader, uno studente, ecc.)]

TONO DI VOCE

Professionale ma accessibile

Chiaro, diretto, non accademico, ma concettualmente rigoroso

Orientato all'apprendimento e alla consultazione rapida

Mantieni la terminologia tecnica quando è utile, spiegandola con frasi semplici quando necessario.

REGOLE E VINCOLI IMPORTANTI

Non chiedere mai all'utente di "aspettare", "tenere duro" o simili: produci sempre la dispensa completa nella stessa risposta.

Non fare domande di chiarimento all'utente: usa al meglio il materiale che hai.

Non aggiungere note personali del tipo "secondo me l'autore…": mantieni un taglio neutro e descrittivo, riportando il pensiero dell'autore del video.

Non cambiare lingua: lavora sempre in italiano, anche se nella trascrizione compaiono parole di altre lingue.

Se nella trascrizione c'è confusione, sovrapposizione o audio disturbato, fai una ricostruzione prudente e lineare, evitando di inventare contenuti.

TRASCRIZIONE:

{{TRANSCRIPT}}`;

// ---------------------------------------------------------------------------
// INTERVISTE
// ---------------------------------------------------------------------------
const INTERVISTE = () => `TASK:

Elabora una trascrizione di intervista YouTube (domande e risposte) e trasformala in contenuto editoriale strutturato.

METADATI DEL VIDEO

Autore: {{AUTORE}}

Titolo: {{TITOLO}}

URL YouTube: {{VIDEO_URL}}

Temi Trattati: {{TEMI_TRATTATI}}

Data di elaborazione: ${dataOggi()}

INPUT:

Trascrizione grezza contenente possibili errori di battitura, parole mal trascritte, intercalari e parti colloquiali.

TRASCRIZIONE:
{{TRANSCRIPT}}

OUTPUT STRUTTURATO:

[SEZIONE_PRESENTAZIONE]

- Presentazione professionale dell'intervistato.

- Basata su introduzione dell'intervistatore + eventuali dettagli emersi nella prima risposta.

- Nessuna informazione inventata.

[SEZIONE_QA]

Ripetere per ogni domanda:

DOMANDA:

- Testo corretto e ripulito.

- Nessun elemento colloquiale.

- Significato invariato.

RISPOSTA:

- Testo corretto, fluido e completo.

- Errori di trascrizione corretti.

- Nessuna sintesi dei contenuti.

TAG:

- 3–7 tag rappresentativi dei temi principali trattati nella risposta.

- Formato hashtag.

[SEZIONE_FINALE]

TAKE_AWAY:

- 10 insight chiave dedotti dai contenuti complessivi.

TEMI_MACRO:

- Elenco macro-argomenti trattati.

- Breve descrizione per ciascuno.

TAG_COMPLETI:

- Elenco unico di tutti i tag.

- Senza duplicati.

- Ordinati per rilevanza.

DOMANDE_ELENCO:

- Elenco numerato di tutte le domande poste.

- Forma corretta e pulita.

REGOLE:

- Nessuna opinione personale.

- Nessuna informazione inventata.

- Nessuna spiegazione del processo.

- Output solo nelle sezioni definite.

- Lavora sempre in italiano.

- Se nella trascrizione c'è confusione, sovrapposizione o audio disturbato, fai una ricostruzione prudente e lineare, evitando di inventare contenuti.`;

// ---------------------------------------------------------------------------
// TED TALK
// ---------------------------------------------------------------------------
const TED_TALK = () => `Agisci come un editor accademico e formatore professionale.

Riceverai la trascrizione completa di un TED Talk.
Il tuo compito è trasformarla in un contenuto di studio professionale.

METADATI DEL VIDEO

Autore: {{AUTORE}}

Titolo: {{TITOLO}}

URL YouTube: {{VIDEO_URL}}

Temi Trattati: {{TEMI_TRATTATI}}

Data di elaborazione: ${dataOggi()}

IMPORTANTE: Usa ESATTAMENTE i valori forniti sopra per Autore e Titolo. Non modificare o riformulare questi metadati, inseriscili così come sono.

ISTRUZIONI:

1. Riorganizza il contenuto in una struttura didattica chiara, usando:
   - Titoli e sottotitoli logici
   - Sequenza: contesto → concetti chiave → implicazioni → applicazioni

2. Per ogni concetto chiave:
   - Fornisci una spiegazione chiara e formale
   - Esplicita eventuali assunti impliciti o semplificazioni tipiche del linguaggio orale

3. Estrai:
   - Le 5–7 idee principali del talk
   - Eventuali modelli, framework o principi ricorrenti (anche se non nominati esplicitamente)

4. Trasforma esempi narrativi o aneddoti in:
   - Insight generalizzabili
   - Lezioni applicabili in contesti professionali

5. Concludi con:
   - Un riepilogo strutturato
   - 3–5 domande di studio o riflessione critica
   - (Opzionale) Possibili ambiti di applicazione pratica

STILE:
- Tono professionale, chiaro, non divulgativo
- Elimina ridondanze, enfasi emotiva e storytelling non funzionale allo studio
- Mantieni fedeltà ai contenuti originali senza introdurre nuove idee

OUTPUT:
- Documento strutturato, pronto per lo studio o la formazione professionale

SEZIONE FINALE

Chiudi sempre con tre sottosezioni:

## Punti chiave da ricordare

- [3–5 bullet sintetici con i messaggi principali]

## Approfondimenti suggeriti

- [Eventuali libri, articoli, autori, modelli citati nel video]
- [Se non ci sono approfondimenti citati, scrivi qualcosa di neutro tipo: "Nel video non sono stati indicati approfondimenti specifici, ma si suggerisce di esplorare la letteratura su …"]

## Domande di studio e riflessione critica

- [3–5 domande di studio o riflessione critica che aiutino a approfondire i concetti trattati]

## Applicazioni pratiche

- [Come usare nella pratica i concetti esposti (es. cosa può fare un/una HR, un manager, un team leader, uno studente, ecc.)]

REGOLE E VINCOLI IMPORTANTI

Non chiedere mai all'utente di "aspettare", "tenere duro" o simili: produci sempre la dispensa completa nella stessa risposta.

Non fare domande di chiarimento all'utente: usa al meglio il materiale che hai.

Non aggiungere note personali del tipo "secondo me l'autore…": mantieni un taglio neutro e descrittivo, riportando il pensiero dell'autore del video.

Non cambiare lingua: lavora sempre in italiano, anche se nella trascrizione compaiono parole di altre lingue.

Se nella trascrizione c'è confusione, sovrapposizione o audio disturbato, fai una ricostruzione prudente e lineare, evitando di inventare contenuti.

TRASCRIZIONE:

{{TRANSCRIPT}}`;

// ---------------------------------------------------------------------------
// TUTORIAL (AI / informatica)
// ---------------------------------------------------------------------------
const TUTORIAL = () => `Sei un esperto educational content designer specializzato nella trasformazione di contenuti video in materiali didattici strutturati.

METADATI DEL VIDEO

Autore: {{AUTORE}}

Titolo: {{TITOLO}}

URL YouTube: {{VIDEO_URL}}

Temi Trattati: {{TEMI_TRATTATI}}

Data di elaborazione: ${dataOggi()}

IMPORTANTE: Usa ESATTAMENTE i valori forniti sopra per Autore e Titolo. Non modificare o riformulare questi metadati, inseriscili così come sono.

COMPITO

Analizza la trascrizione del video tutorial fornita e trasformala in una dispensa educativa completa, organizzata e facilmente consultabile.

STRUTTURA DELLA DISPENSA

1. METADATA
- Titolo del tutorial: [Estrai o crea un titolo descrittivo]
- Autore/Canale: [Se menzionato]
- Link video: [Se presente]
- Durata stimata di lettura: [Calcola in base al contenuto]
- Livello di difficoltà: [Principiante/Intermedio/Avanzato]
- Argomenti chiave: [Elenca 3-5 tag principali]

2. ABSTRACT INIZIALE (150-250 parole)
Crea un riassunto conciso che includa:

- Cosa imparerai: Obiettivo principale del tutorial
- Per chi è: Target audience e prerequisiti
- Perché è utile: Benefici pratici e applicazioni
- Risultati attesi: Cosa saprai fare al termine

3. INDICE DEGLI ARGOMENTI

Crea un indice numerato con tutti i punti principali trattati, con riferimenti alle sezioni.

4. CONTENUTO PRINCIPALE

Organizza il contenuto seguendo questa struttura modulare:

Per ogni CONCETTO/TRUCCO/FUNZIONALITÀ:

[NUMERO]. [TITOLO DEL CONCETTO]

▸ Cosa è: Definizione chiara e concisa
▸ Perché è importante: Contesto e rilevanza
▸ Come funziona: Spiegazione dettagliata del meccanismo
▸ Esempio pratico: Caso d'uso concreto estratto dal video
▸ Passaggi operativi:
  1. Primo step
  2. Secondo step
  3. [etc.]
▸ Suggerimenti avanzati: Tips e best practices
▸ Errori comuni da evitare: Warning e cautele
▸ Collegamento con: [Link a concetti correlati nella dispensa]

5. RACCOLTA PROMPT E COMANDI

Crea una sezione dedicata con tutti i prompt/comandi/codici menzionati:

PROMPT [NUMERO] - [NOME DESCRITTIVO]

[Testo esatto del prompt]

→ Scopo: [A cosa serve]
→ Quando usarlo: [Contesto d'uso]
→ Varianti possibili: [Modifiche suggerite]
→ Output atteso: [Cosa ci si aspetta come risultato]

[Ripeti la struttura per ogni prompt identificato]

6. ESEMPI COMMENTATI

Riporta gli esempi più significativi dal video con:

ESEMPIO [NUMERO]: [TITOLO DESCRITTIVO]

- Scenario: Descrizione del caso d'uso
- Input: Cosa è stato fornito
- Processo: Steps seguiti
- Output: Risultato ottenuto
- Analisi: Perché funziona e cosa imparare

7. FRAMEWORK E METODOLOGIE

Se nel video vengono presentati framework (es. TCRI, Chain of Thought, etc.):

FRAMEWORK: [NOME]

COMPONENTI:
- Componente 1: [Spiegazione]
- Componente 2: [Spiegazione]
- Componente 3: [Spiegazione]
[etc.]

TEMPLATE DI APPLICAZIONE:
[Fornisci un template vuoto da compilare]

ESEMPIO COMPILATO:
[Fornisci un esempio completo]

8. CHECKLIST OPERATIVA

Crea una checklist "quick reference" per applicare immediatamente quanto appreso:

☐ Azione 1
☐ Azione 2
☐ Azione 3
☐ Azione 4
☐ Azione 5
[etc.]

9. RISORSE AGGIUNTIVE

- Strumenti menzionati: [Lista con link se disponibili]
- Integrazioni suggerite: [App, servizi, API]
- Approfondimenti: [Argomenti correlati da studiare]

10. GLOSSARIO

Definizioni dei termini tecnici utilizzati:

- Termine 1: Spiegazione semplice
- Termine 2: Spiegazione semplice
- Termine 3: Spiegazione semplice
[etc.]

11. FAQ - DOMANDE FREQUENTI

Anticipa domande comuni basate sul contenuto:

Q: [Domanda frequente 1]
A: [Risposta chiara e concisa]

Q: [Domanda frequente 2]
A: [Risposta chiara e concisa]

[etc.]

12. ESERCIZI PRATICI

Proponi 3-5 esercizi per mettere in pratica quanto appreso:

ESERCIZIO [NUMERO]: [TITOLO]

- Obiettivo: [...]
- Strumenti necessari: [...]
- Steps:
  1. [...]
  2. [...]
  3. [...]
- Soluzione suggerita: [...]

LINEE GUIDA DI FORMATTAZIONE

1. CHIAREZZA: Usa linguaggio semplice e diretto
2. STRUTTURA VISIVA: Sfrutta heading, bullet points, box evidenziati
3. ESEMPI CONCRETI: Preferisci sempre esempi pratici alle spiegazioni astratte
4. PROGRESSIONE LOGICA: Dal semplice al complesso
5. RIFERIMENTI INCROCIATI: Collega sezioni correlate
6. HIGHLIGHTING: Evidenzia concetti chiave, warning, e best practices
7. CODICI/PROMPT: Usa blocchi di testo formattati per tutti i comandi
8. NUMERAZIONE: Mantieni numerazione consistente per facilitare riferimenti

ELEMENTI DA PRESERVARE

✓ Tutti i prompt esatti menzionati nel video
✓ Sequenze di passaggi operative
✓ Warning e cautele dell'autore
✓ Esempi specifici con risultati mostrati
✓ Nomi di strumenti, funzionalità, e modelli
✓ Link e riferimenti citati

ELEMENTI DA OMETTERE

✗ Saluti e formule di cortesia ripetitive
✗ Richieste di like/iscrizioni/commenti
✗ Sponsor e pubblicità (a meno che non siano strumenti rilevanti)
✗ Divagazioni personali non pertinenti
✗ Contenuti duplicati o ripetizioni

CARATTERISTICHE DELL'OUTPUT FINALE

La dispensa deve essere:

► AUTOCONSISTENTE: Comprensibile anche senza vedere il video
► CONSULTABILE RAPIDAMENTE: Con indice e sezioni ben definite
► PRATICA: Con focus sull'applicazione immediata
► COMPLETA: Senza omettere informazioni tecniche importanti
► PROFESSIONALE: Con formattazione curata e leggibile

REGOLE E VINCOLI IMPORTANTI

Non chiedere mai all'utente di "aspettare", "tenere duro" o simili: produci sempre la dispensa completa nella stessa risposta.

Non fare domande di chiarimento all'utente: usa al meglio il materiale che hai.

Non aggiungere note personali del tipo "secondo me l'autore…": mantieni un taglio neutro e descrittivo, riportando il pensiero dell'autore del video.

Non cambiare lingua: lavora sempre in italiano, anche se nella trascrizione compaiono parole di altre lingue.

Se nella trascrizione c'è confusione, sovrapposizione o audio disturbato, fai una ricostruzione prudente e lineare, evitando di inventare contenuti.

TRASCRIZIONE:

{{TRANSCRIPT}}`;

const TEMPLATES = {
  standard: STANDARD,
  interviste: INTERVISTE,
  ted: TED_TALK,
  tutorial: TUTORIAL
};

/**
 * Sceglie la famiglia di prompt in base al nome della cartella di destinazione.
 * Stessa logica di priorita' della v1.
 */
export function selectKind(category) {
  const c = (category || '').toUpperCase();
  if (c.includes('INTERVIST')) return 'interviste';
  if (c.includes('TED') || c === 'TALK' || c === 'TEDTALK' || c === 'TED-TALK') return 'ted';
  if (
    c.includes('TUTORIAL') || c.includes('AI') || c.includes('INFORMATICA') ||
    c.includes('PROGRAMMAZIONE') || c.includes('CODING') || c.includes('TECNOLOGIA')
  ) return 'tutorial';
  return 'standard';
}

function fill(template, meta, transcript) {
  return template
    .split('{{VIDEO_URL}}').join(meta.videoUrl || 'Non disponibile')
    .split('{{TEMI_TRATTATI}}').join(meta.temiTrattati || 'Non disponibile')
    .split('{{AUTORE}}').join(meta.author || 'Non disponibile')
    .split('{{TITOLO}}').join(meta.title || 'Non disponibile')
    .split('{{TRANSCRIPT}}').join(transcript);
}

/**
 * Costruisce il prompt per un segmento di trascrizione.
 *
 * Con total === 1 restituisce il prompt v1 identico.
 * Con total > 1 aggiunge il wrapper che delimita la porzione da elaborare.
 */
export function buildSegmentPrompt({ kind, meta, transcript, index, total }) {
  const base = fill((TEMPLATES[kind] || STANDARD)(), meta, transcript);
  if (total <= 1) return base;

  const isFirst = index === 0;
  const isLast = index === total - 1;

  const header = `ELABORAZIONE A SEGMENTI — SEGMENTO ${index + 1} DI ${total}

La trascrizione di questo video e' troppo lunga per una singola elaborazione, quindi e' stata divisa in ${total} segmenti consecutivi. Tu stai elaborando il segmento ${index + 1}.

Applica tutte le istruzioni che seguono, ma limitatamente al testo di QUESTO segmento, e rispetta queste regole di assemblaggio:

- NON scrivere il blocco METADATI DEL VIDEO e NON scrivere l'ABSTRACT (o la sezione equivalente di apertura): vengono composti a parte e anteposti al tuo testo. Inizia direttamente dal corpo del documento.
${isFirst
  ? '- Sei il PRIMO segmento: apri con la prima macro-sezione del corpo.'
  : '- NON sei il primo segmento: riprendi il discorso dal punto in cui si e\' interrotto, come continuazione naturale del testo precedente, senza introduzioni.'}
${isLast
  ? '- Sei l\'ULTIMO segmento: chiudi con le sottosezioni finali previste dalle istruzioni (punti chiave, approfondimenti, applicazioni pratiche, ecc.), riferite al video nel suo complesso.'
  : '- NON sei l\'ultimo segmento: NON scrivere sezioni conclusive, riepiloghi finali, punti chiave o applicazioni pratiche. Il documento prosegue oltre questo segmento.'}
- Non annunciare mai di essere un segmento e non scrivere frasi come "in questa parte" o "continua": il testo verra' unito agli altri e deve risultare un documento unico e continuo.
- Non numerare le macro-sezioni ripartendo da 1 se non sei il primo segmento.

────────────────────────────────────────

`;

  // Il promemoria finale conta piu' di quello iniziale: la struttura dettagliata
  // del template sopra dice "apri con i METADATI" e, senza questo blocco in coda,
  // i segmenti successivi al primo la seguivano comunque. Verificato sul campo.
  const footer = `

────────────────────────────────────────
PROMEMORIA FINALE — SEGMENTO ${index + 1} DI ${total}

La struttura descritta sopra vale per il documento COMPLETO, non per il tuo segmento. Per questo segmento in particolare:

1. NON scrivere il blocco "METADATI DEL VIDEO" e NON riportare le righe Autore / Titolo / URL YouTube / Temi Trattati / Data di elaborazione. Sono gia' presenti nel documento finale.
2. NON scrivere ABSTRACT, SEZIONE_PRESENTAZIONE, METADATA o qualunque altra sezione di apertura.
3. La tua risposta deve iniziare direttamente con ${isFirst ? 'la prima macro-sezione del corpo (un titolo Markdown)' : 'la prosecuzione del corpo, riprendendo il filo del discorso'}.
${isLast
  ? '4. Chiudi con le sottosezioni finali previste (punti chiave, approfondimenti, applicazioni pratiche…).'
  : '4. NON scrivere sezioni conclusive: il documento prosegue dopo di te.'}`;

  return header + base + footer;
}

/**
 * Prompt breve e veloce per generare ABSTRACT + metadati.
 * Sostituisce le regex fragili della v1 che tentavano di estrarre l'abstract
 * dall'output gia' generato.
 */
export function buildAbstractPrompt({ kind, meta, outline }) {
  const cosa = {
    standard: 'un ABSTRACT di 3-4 righe che sintetizzi argomento principale, obiettivi formativi, punti chiave e target di riferimento',
    interviste: 'una SEZIONE_PRESENTAZIONE: presentazione professionale dell\'intervistato in 3-5 righe, basata solo su quanto emerge dal contenuto, senza inventare nulla',
    ted: 'una sezione "Contesto e Obiettivo del Talk" di 3-5 righe che inquadri il tema e lo scopo dell\'intervento',
    tutorial: 'un blocco METADATA con queste righe, una per riga e ciascuna preceduta da "- ": Titolo del tutorial, Autore/Canale, Livello di difficolta\' (Principiante/Intermedio/Avanzato), Argomenti chiave (3-5 tag)'
  }[kind] || 'un ABSTRACT di 3-4 righe';

  return `Sei un redattore didattico. Sulla base della struttura della dispensa qui sotto, scrivi ${cosa}.

Metadati del video:
- Autore: ${meta.author || 'Non disponibile'}
- Titolo: ${meta.title || 'Non disponibile'}
- URL: ${meta.videoUrl || 'Non disponibile'}
- Temi: ${meta.temiTrattati || 'Non disponibile'}

REGOLE:
- Scrivi in italiano.
- Restituisci SOLO il testo richiesto, senza titoli di sezione, senza markdown, senza preamboli.
- Massimo 900 caratteri.
- Non inventare contenuti assenti dalla struttura.

STRUTTURA DELLA DISPENSA:

${outline}`;
}

export default { selectKind, buildSegmentPrompt, buildAbstractPrompt };
