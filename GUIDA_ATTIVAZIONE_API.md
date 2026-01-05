# 🔧 Guida Completa: Attivazione API per Vercel

Questa guida ti accompagna passo dopo passo nell'attivazione di tutte le API necessarie per far funzionare l'applicazione "Studia i tuoi Video Preferiti" su **Vercel**.

⚠️ **IMPORTANTE**: Tutte le API keys sono gestite tramite **variabili d'ambiente Vercel** per massima sicurezza. Non devi mai inserire chiavi API nel codice!

---

## 📋 Indice

1. [OpenAI API](#1-openai-api) - Per l'elaborazione AI della trascrizione
2. [Google Cloud Setup](#2-google-cloud-setup) - Configurazione iniziale
3. [YouTube Data API](#3-youtube-data-api) - Per estrarre trascrizioni e metadati
4. [Google Drive API](#4-google-drive-api) - Per salvare i documenti
5. [Gmail API](#5-gmail-api) - Per inviare email di notifica
6. [Google Sheets API](#6-google-sheets-api) - Per il tracciamento dei documenti
7. [Configurazione Vercel](#7-configurazione-vercel) - Impostare tutte le variabili d'ambiente

---

## 1. OpenAI API

### Scopo
Elaborazione della trascrizione video in dispense didattiche strutturate usando GPT-4o-mini (modello economico e adatto).

### Passi per l'attivazione:

#### 1.1 Crea un account OpenAI
1. Vai su https://platform.openai.com/
2. Clicca su "Sign up" e crea un account
3. Verifica la tua email

#### 1.2 Aggiungi un metodo di pagamento
1. Vai su https://platform.openai.com/account/billing
2. Clicca su "Add payment method"
3. Inserisci i dati della tua carta di credito
4. ⚠️ **Nota**: OpenAI addebita solo l'uso effettivo (pay-as-you-go)

#### 1.3 Genera una API Key
1. Vai su https://platform.openai.com/api-keys
2. Clicca su "Create new secret key"
3. Assegna un nome (es. "Studia Video YouTube")
4. **COPIA SUBITO LA CHIAVE** (non sarà più visibile)
5. Salvala temporaneamente in un posto sicuro (la userai in Vercel)

#### 1.4 Variabili d'Ambiente per Vercel
Le seguenti variabili vanno configurate in Vercel (vedi sezione 7):

```
OPENAI_API_KEY = sk-proj-... (la tua chiave copiata)
OPENAI_MODEL = gpt-4o-mini
OPENAI_MAX_TOKENS = 8000
OPENAI_TEMPERATURE = 0.7
```

#### 1.5 Costi stimati
- **GPT-4o-mini**: $0.15 per 1M token input, $0.60 per 1M token output
- **Video 30 min**: ~$0.0036
- **Video 4 ore**: ~$0.014
- Molto economico rispetto ad altri modelli!

---

## 2. Google Cloud Setup

### Scopo
Configurare un progetto Google Cloud per tutte le API Google (YouTube, Drive, Gmail, Sheets).

### Passi per l'attivazione:

#### 2.1 Crea un progetto Google Cloud
1. Vai su https://console.cloud.google.com/
2. Accedi con il tuo account Google
3. Clicca sul menu a tendina dei progetti in alto
4. Clicca su "New Project"
5. Nome: "Studia Video YouTube" (o altro)
6. Clicca "Create"
7. ⏳ Attendi qualche secondo che il progetto venga creato

#### 2.2 Abilita la fatturazione (se richiesto)
- Google Cloud offre un tier gratuito generoso
- Per la maggior parte delle API, non serve abilitare la fatturazione
- Se richiesto, segui le istruzioni (non verrai addebitato per l'uso normale)

---

## 3. YouTube Data API

### Scopo
Estrarre metadati (titolo, autore) dai video YouTube.

### Passi per l'attivazione:

#### 3.1 Abilita YouTube Data API v3
1. Nella Google Cloud Console del tuo progetto
2. Vai su "APIs & Services" > "Library"
3. Cerca "YouTube Data API v3"
4. Clicca sul risultato
5. Clicca "Enable"
6. ⏳ Attendi qualche secondo

#### 3.2 Crea API Key
1. Vai su "APIs & Services" > "Credentials"
2. Clicca "Create Credentials" > "API key"
3. **COPIA la chiave API generata**
4. (Opzionale) Clicca sulla chiave per limitarla:
   - Application restrictions: "HTTP referrers"
   - Website restrictions: aggiungi il tuo dominio Vercel (es. `https://tuodominio.vercel.app/*`)

#### 3.3 Variabile d'Ambiente per Vercel
```
YOUTUBE_API_KEY = AIzaSy... (la tua chiave copiata)
```

#### 3.4 Quota gratuita
- **10.000 unità/giorno** (più che sufficiente per uso normale)
- 1 richiesta = 1 unità

---

## 4. Google Drive API

### Scopo
Salvare automaticamente i documenti generati in Google Drive, organizzati per categoria.

### Passi per l'attivazione:

#### 4.1 Abilita Google Drive API e Google Docs API
1. Nella Google Cloud Console
2. Vai su **"API e servizi"** > **"Libreria"** (APIs & Services > Library)
3. Nella barra di ricerca, cerca: `Google Drive API`
4. Clicca sul risultato "Google Drive API"
5. Clicca **"Abilita"** (Enable)
6. ⏳ Attendi qualche secondo per l'attivazione
7. Cerca anche: `Google Docs API`
8. Clicca **"Abilita"** (Enable)
9. ⏳ Attendi qualche secondo per l'attivazione

⚠️ **IMPORTANTE**: Entrambe le API devono essere abilitate per la formattazione corretta dei documenti!

#### 4.2 Crea credenziali OAuth 2.0

**IMPORTANTE**: Se è la prima volta che crei credenziali OAuth, Google ti chiederà di configurare la schermata di consenso OAuth. Segui questi passi:

##### Passo A: Configurazione Schermata di Consenso OAuth (se richiesto)

⚠️ **Nota**: Questo passaggio è necessario solo se è la prima volta che crei credenziali OAuth nel progetto. Se hai già configurato la schermata di consenso, vai direttamente al Passo D.

1. Vai su **"API e servizi"** > **"Schermata di consenso OAuth"** (menu laterale sinistro)
   - Se non vedi questa opzione, vai su "APIs & Services" > "OAuth consent screen"
2. Seleziona il tipo utente:
   - **"Esterno"** (External) - per account Google personali ✅ **Scegli questo se usi un account Google normale**
   - **"Interno"** (Internal) - solo se hai Google Workspace
3. Clicca **"Crea"** (Create)
4. Compila il modulo:
   - **Nome app**: `Studia Video YouTube`
   - **Email di supporto utente**: la tua email
   - **Logo app**: (opzionale, puoi saltare)
   - **Dominio autorizzato dell'app**: (lascia vuoto per ora)
   - **Email del supporto sviluppatore**: la tua email
5. Clicca **"Salva e continua"** (Save and Continue)

##### Passo B: Configurazione Scope (Permessi)

1. Nella sezione **"Scope"** (Ambiti), clicca **"Aggiungi o rimuovi scope"** (Add or Remove Scopes)
2. Si aprirà una finestra con tutti gli scope disponibili. Cerca e seleziona questi scope (usa la barra di ricerca in alto):
   - Cerca **"drive"** nella barra di ricerca e seleziona: 
     - ✅ `https://www.googleapis.com/auth/drive.file` (permette di creare e modificare file)
   - Cerca **"gmail"** nella barra di ricerca e seleziona:
     - ✅ `https://www.googleapis.com/auth/gmail.send` (permette di inviare email)
   - Cerca **"sheets"** nella barra di ricerca e seleziona:
     - ✅ `https://www.googleapis.com/auth/spreadsheets` (permette di modificare fogli di calcolo)
3. Clicca **"Aggiorna"** (Update) in basso
4. Clicca **"Salva e continua"** (Save and Continue)

##### Passo C: Utenti di Test (se app in modalità test)

⚠️ **Nota**: Se hai selezionato "Esterno" come tipo utente, l'app sarà in modalità test e dovrai aggiungere utenti di test.

1. Nella sezione **"Utenti di test"** (Test users), clicca **"Aggiungi utenti"** (Add Users)
2. Inserisci la tua email (quella che userai per testare l'app)
3. Clicca **"Aggiungi"** (Add)
4. Puoi aggiungere più email se necessario
5. Clicca **"Salva e continua"** (Save and Continue)

6. Rivedi il riepilogo e clicca **"Torna al dashboard"** (Back to Dashboard) o **"Fine"** (Done)

##### Passo D: Crea le Credenziali OAuth Client ID

1. Vai su **"API e servizi"** > **"Credenziali"** (APIs & Services > Credentials)
2. Clicca **"Crea credenziali"** (Create Credentials) in alto
3. Seleziona **"ID client OAuth"** (OAuth client ID)

##### Passo E: Configura il Client OAuth

1. **Tipo di applicazione**: Seleziona **"Applicazione Web"** (Web application)
2. **Nome**: `Studia Video YouTube Web Client`
3. **Origini JavaScript autorizzate**: Clicca **"Aggiungi URI"** (Add URI) e aggiungi:
   - `http://localhost:3000` (per sviluppo locale, opzionale)
   - `https://tuodominio.vercel.app` (sostituisci con il tuo dominio Vercel - lo aggiungerai dopo il primo deploy)
   
   ⚠️ **Nota**: Se non hai ancora il dominio Vercel, puoi aggiungerlo dopo. Per ora lascia solo localhost o salta questo passaggio.

4. **URI di reindirizzamento autorizzati**: Clicca **"Aggiungi URI"** (Add URI) e aggiungi:
   - `http://localhost:3000/api/auth?action=callback` (per sviluppo, opzionale)
   - `https://tuodominio.vercel.app/api/auth?action=callback` (sostituisci con il tuo dominio - lo aggiungerai dopo)
   
   ⚠️ **Nota**: Dopo il primo deploy su Vercel, torna qui e aggiungi il dominio reale!

5. Clicca **"Crea"** (Create)

##### Passo F: Copia le Credenziali

1. Ti verrà mostrata una finestra con:
   - **ID client** (Client ID): `xxxxxx-xxxxx.apps.googleusercontent.com`
   - **Segreto client** (Client Secret): `GOCSPX-xxxxx`
   
2. **COPIA SUBITO ENTRAMBI** - il segreto client non sarà più visibile!
3. Salvali temporaneamente in un posto sicuro (li userai in Vercel)
4. Clicca **"OK"** (OK)

⚠️ **IMPORTANTE**: Dopo il primo deploy su Vercel, otterrai il dominio. Torna qui e aggiungi il dominio reale negli URI autorizzati!

#### 4.4 Crea una cartella in Google Drive
1. Vai su https://drive.google.com
2. Crea una nuova cartella (es. "Dispense Video")
3. Clicca con tasto destro sulla cartella > "Condividi" > "Ottieni link"
4. Imposta "Chiunque con il link può visualizzare" (o "Editor" se vuoi)
5. Copia l'ID della cartella dall'URL:
   - URL esempio: `https://drive.google.com/drive/folders/1nhFM1-c2lG9xKPdMjQfLPqU6jtofrRRH`
   - ID: `1nhFM1-c2lG9xKPdMjQfLPqU6jtofrRRH` (la parte dopo `/folders/`)

#### 4.5 Variabili d'Ambiente per Vercel
```
GOOGLE_CLIENT_ID = xxxxxx-xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = GOCSPX-xxxxx
GOOGLE_REDIRECT_URI = https://tuodominio.vercel.app/api/auth?action=callback
GOOGLE_DRIVE_FOLDER_ID = 1nhFM1-c2lG9xKPdMjQfLPqU6jtofrRRH
```

⚠️ **IMPORTANTE**: Aggiorna `GOOGLE_REDIRECT_URI` dopo il primo deploy con il dominio Vercel reale!

---

## 5. Gmail API

### Scopo
Inviare email di notifica quando una dispensa viene creata.

### Passi per l'attivazione:

#### 5.1 Abilita Gmail API
1. Nella Google Cloud Console
2. Vai su **"API e servizi"** > **"Libreria"** (APIs & Services > Library)
3. Nella barra di ricerca, cerca: `Gmail API`
4. Clicca sul risultato "Gmail API"
5. Clicca **"Abilita"** (Enable)
6. ⏳ Attendi qualche secondo per l'attivazione

#### 5.2 Verifica scope OAuth
Gli scope Gmail sono già inclusi nelle credenziali OAuth create al punto 4.2:
- `https://www.googleapis.com/auth/gmail.send`

Se non li hai aggiunti, torna al punto 4.2 e aggiungili.

#### 5.3 Variabile d'Ambiente per Vercel
```
NOTIFICATION_EMAIL = roberto.micarelli@gmail.com
```
(Sostituisci con la tua email)

---

## 6. Google Sheets API

### Scopo
Tracciare tutti i documenti generati in un foglio di calcolo per riferimento futuro.

### Passi per l'attivazione:

#### 6.1 Abilita Google Sheets API
1. Nella Google Cloud Console
2. Vai su **"API e servizi"** > **"Libreria"** (APIs & Services > Library)
3. Nella barra di ricerca, cerca: `Google Sheets API`
4. Clicca sul risultato "Google Sheets API"
5. Clicca **"Abilita"** (Enable)
6. ⏳ Attendi qualche secondo per l'attivazione

#### 6.2 Verifica scope OAuth
Lo scope Sheets è già incluso nelle credenziali OAuth create al punto 4.2:
- `https://www.googleapis.com/auth/spreadsheets`

#### 6.3 Crea un Google Sheet
1. Vai su https://sheets.google.com
2. Crea un nuovo foglio
3. Nella prima riga, aggiungi queste intestazioni:
   ```
   Timestamp | Titolo | URL Video | URL Documento | Categoria | Abstract
   ```
4. Clicca "Condividi" (in alto a destra)
5. Clicca "Ottieni link"
6. Imposta "Chiunque con il link può modificare"
7. Copia l'ID del foglio dall'URL:
   - URL esempio: `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`
   - ID: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms` (la parte tra `/d/` e `/edit`)

#### 6.4 Variabile d'Ambiente per Vercel
```
GOOGLE_SHEETS_ID = 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
```
(Sostituisci con l'ID del tuo foglio)

---

## 7. Configurazione Vercel

### Scopo
Configurare tutte le variabili d'ambiente in Vercel per far funzionare l'app.

### Passi per la configurazione:

#### 7.1 Accedi a Vercel
1. Vai su https://vercel.com
2. Accedi con GitHub
3. Seleziona il tuo progetto "studia-video-youtube"

#### 7.2 Vai alle Environment Variables
1. Clicca su "Settings" (nel menu del progetto)
2. Clicca su "Environment Variables" (menu laterale)

#### 7.3 Aggiungi tutte le variabili

Aggiungi una per una tutte queste variabili:

**OpenAI:**
```
Key: OPENAI_API_KEY
Value: sk-proj-... (la tua chiave OpenAI)
```

```
Key: OPENAI_MODEL
Value: gpt-4o-mini
```

```
Key: OPENAI_MAX_TOKENS
Value: 8000
```

```
Key: OPENAI_TEMPERATURE
Value: 0.7
```

**YouTube:**
```
Key: YOUTUBE_API_KEY
Value: AIzaSy... (la tua chiave YouTube)
```

**Google OAuth:**
```
Key: GOOGLE_CLIENT_ID
Value: xxxxxx-xxxxx.apps.googleusercontent.com
```

```
Key: GOOGLE_CLIENT_SECRET
Value: GOCSPX-xxxxx
```

```
Key: GOOGLE_REDIRECT_URI
Value: https://tuodominio.vercel.app/api/auth?action=callback
```
⚠️ **IMPORTANTE**: Dopo il primo deploy, Vercel ti assegnerà un dominio. Aggiorna questa variabile con il dominio reale!

**Google Drive:**
```
Key: GOOGLE_DRIVE_FOLDER_ID
Value: 1nhFM1-c2lG9xKPdMjQfLPqU6jtofrRRH
```
(Sostituisci con l'ID della tua cartella)

**Google Sheets:**
```
Key: GOOGLE_SHEETS_ID
Value: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
```
(Sostituisci con l'ID del tuo foglio)

**Email:**
```
Key: NOTIFICATION_EMAIL
Value: roberto.micarelli@gmail.com
```
(Sostituisci con la tua email)

#### 7.4 Applica a tutti gli ambienti
Per ogni variabile, seleziona:
- ✅ Production
- ✅ Preview
- ✅ Development

#### 7.5 Deploy
1. Dopo aver aggiunto tutte le variabili, vai su "Deployments"
2. Clicca sui tre puntini del deployment più recente
3. Clicca "Redeploy"
4. Oppure fai un nuovo commit e push su GitHub (deploy automatico)

#### 7.6 Aggiorna Redirect URI (DOPO il primo deploy)

Dopo il deploy, Vercel ti assegnerà un dominio (es. `studia-video-youtube-abc123.vercel.app`):

1. **In Vercel**:
   - Vai su Settings > Environment Variables
   - Trova `GOOGLE_REDIRECT_URI`
   - Aggiorna con: `https://tuodominio.vercel.app/api/auth?action=callback`
   - Salva

2. **In Google Cloud Console**:
   - Vai su **"API e servizi"** > **"Credenziali"** (APIs & Services > Credentials)
   - Clicca sul nome delle tue credenziali OAuth 2.0 (ID client OAuth)
   - Scorri fino a **"URI di reindirizzamento autorizzati"** (Authorized redirect URIs)
   - Clicca **"Aggiungi URI"** (Add URI)
   - Aggiungi: `https://tuodominio.vercel.app/api/auth?action=callback`
   - Clicca **"Salva"** (Save)

3. **Redeploy su Vercel**

---

## ✅ Checklist Completa

Usa questa checklist per assicurarti di aver fatto tutto:

### OpenAI
- [ ] Account OpenAI creato
- [ ] Metodo di pagamento aggiunto
- [ ] API key generata e copiata
- [ ] Variabili d'ambiente configurate in Vercel

### Google Cloud
- [ ] Progetto Google Cloud creato
- [ ] YouTube Data API v3 abilitata
- [ ] Google Drive API abilitata
- [ ] Gmail API abilitata
- [ ] Google Sheets API abilitata

### Credenziali OAuth
- [ ] Credenziali OAuth 2.0 create
- [ ] Client ID e Secret copiati
- [ ] Redirect URI configurato (dopo primo deploy)
- [ ] Scope configurati (Drive, Gmail, Sheets)

### Google Drive
- [ ] Cartella Drive creata
- [ ] ID cartella copiato
- [ ] Variabile `GOOGLE_DRIVE_FOLDER_ID` configurata in Vercel

### Google Sheets
- [ ] Foglio Google Sheets creato
- [ ] Intestazioni aggiunte (Timestamp, Titolo, URL Video, ecc.)
- [ ] ID foglio copiato
- [ ] Variabile `GOOGLE_SHEETS_ID` configurata in Vercel

### Vercel
- [ ] Tutte le variabili d'ambiente aggiunte
- [ ] Variabili applicate a Production, Preview, Development
- [ ] Deploy completato
- [ ] Redirect URI aggiornato dopo il primo deploy

### Test
- [ ] App accessibile su Vercel
- [ ] Autenticazione Google funzionante
- [ ] Test con video YouTube breve
- [ ] Verifica salvataggio su Drive
- [ ] Verifica email ricevuta
- [ ] Verifica aggiornamento Google Sheets

---

## 🐛 Troubleshooting

### Errore: "API key non configurata"
- Verifica che tutte le variabili siano presenti in Vercel
- Assicurati di aver fatto un nuovo deploy dopo aver aggiunto le variabili
- Controlla che le variabili siano applicate all'ambiente corretto (Production)

### Errore: "redirect_uri_mismatch"
- Verifica che `GOOGLE_REDIRECT_URI` in Vercel corrisponda esattamente a quello in Google Cloud Console
- Assicurati che non ci siano spazi o caratteri extra
- Controlla che il dominio sia corretto (senza trailing slash)

### Errore: "insufficient permissions"
- Verifica che tutti gli scope siano configurati in Google Cloud Console
- Disconnetti e riconnetti con Google nell'app
- Assicurati di autorizzare tutti i permessi richiesti

### Le API routes non funzionano
- Verifica i log di Vercel: Deployments > [deployment] > Functions
- Controlla che i file siano nella cartella `/api/`
- Verifica che `vercel.json` sia presente e corretto

---

## 💰 Costi Stimati

- **OpenAI GPT-4o-mini**: ~$0.003-0.014 per video (dipende dalla lunghezza)
- **Google APIs**: Gratuite fino a quote generose (10K richieste/giorno)
- **Vercel**: Tier gratuito include 100GB bandwidth/mese

**Totale stimato per 100 video**: ~$0.30-1.40

---

## 📚 Risorse Utili

- [OpenAI Platform](https://platform.openai.com/)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Documentazione Vercel](https://vercel.com/docs)

---

## 🆘 Supporto

- OpenAI: https://help.openai.com/
- Google Cloud: https://cloud.google.com/support
- Vercel: https://vercel.com/support

---

**Buona configurazione! 🎉**

Una volta completata questa guida, l'app sarà completamente funzionante su Vercel con tutte le API configurate in modo sicuro tramite variabili d'ambiente.
