# 📚 Studia i tuoi Video Preferiti

App web per trasformare video YouTube in dispense didattiche professionali usando OpenAI GPT-4o-mini.

## 🚀 Deployment su Vercel

Questa app è configurata per essere deployata su Vercel **tramite GitHub** con tutte le API keys protette tramite variabili d'ambiente.

📖 **Guida completa**: Vedi [DEPLOYMENT_GITHUB_VERCEL.md](./DEPLOYMENT_GITHUB_VERCEL.md) per istruzioni dettagliate passo-passo.

### Prerequisiti

- Account GitHub
- Account Vercel (gratuito)
- Account OpenAI
- Account Google Cloud (per Drive, Gmail, Sheets, YouTube APIs)

### Passi per il Deployment

#### 1. Prepara il Repository GitHub

```bash
# Inizializza git (se non già fatto)
git init

# Aggiungi tutti i file
git add .

# Commit iniziale
git commit -m "Initial commit: Studia Video YouTube app"

# Crea repository su GitHub e aggiungi remote
git remote add origin https://github.com/TUO_USERNAME/studia-video-youtube.git
git branch -M main
git push -u origin main
```

#### 2. Configura Vercel

1. **Vai su Vercel**
   - Apri https://vercel.com
   - Accedi con GitHub
   - Clicca "New Project"

2. **Importa il Repository**
   - Seleziona il repository `studia-video-youtube`
   - Vercel rileverà automaticamente la configurazione

3. **Configura le Variabili d'Ambiente**
   
   Nel pannello "Environment Variables" di Vercel, aggiungi tutte le variabili dal file `.env.example`:

   **OpenAI:**
   - `OPENAI_API_KEY` = la tua chiave OpenAI
   - `OPENAI_MODEL` = `gpt-4o-mini` (opzionale, default)
   - `OPENAI_MAX_TOKENS` = `4000` (opzionale)
   - `OPENAI_TEMPERATURE` = `0.7` (opzionale)

   **YouTube:**
   - `YOUTUBE_API_KEY` = la tua chiave YouTube Data API v3

   **Google OAuth:**
   - `GOOGLE_CLIENT_ID` = il tuo Client ID OAuth
   - `GOOGLE_CLIENT_SECRET` = il tuo Client Secret OAuth
   - `GOOGLE_REDIRECT_URI` = `https://tuodominio.vercel.app/api/auth?action=callback`
     - ⚠️ **IMPORTANTE**: Sostituisci `tuodominio` con il dominio Vercel assegnato

   **Google Drive:**
   - `GOOGLE_DRIVE_FOLDER_ID` = ID della cartella Drive

   **Google Sheets:**
   - `GOOGLE_SHEETS_ID` = ID del foglio Google Sheets

   **Email:**
   - `NOTIFICATION_EMAIL` = email per le notifiche

4. **Deploy**
   - Clicca "Deploy"
   - Attendi il completamento (circa 1-2 minuti)

#### 3. Aggiorna Google OAuth Redirect URI

Dopo il deploy, Vercel ti assegnerà un dominio (es. `studia-video-youtube.vercel.app`).

1. **Vai su Google Cloud Console**
   - https://console.cloud.google.com/apis/credentials
   - Apri le tue credenziali OAuth 2.0

2. **Aggiungi Redirect URI**
   - Aggiungi: `https://tuodominio.vercel.app/api/auth?action=callback`
   - Salva

3. **Aggiorna variabile Vercel**
   - Vai su Vercel > Settings > Environment Variables
   - Aggiorna `GOOGLE_REDIRECT_URI` con il dominio corretto
   - Fai un nuovo deploy

#### 4. Test dell'App

1. Apri l'URL Vercel (es. `https://studia-video-youtube.vercel.app`)
2. Clicca "Accedi con Google" per autenticarti
3. Inserisci un URL YouTube
4. Clicca "Genera Dispensa"
5. Verifica che tutto funzioni correttamente

## 📁 Struttura del Progetto

```
studia-video-youtube/
├── api/                    # Vercel Serverless Functions
│   ├── openai.js          # Endpoint OpenAI
│   ├── youtube.js         # Endpoint YouTube
│   ├── drive.js           # Endpoint Google Drive
│   ├── gmail.js           # Endpoint Gmail
│   ├── sheets.js          # Endpoint Google Sheets
│   └── auth.js            # Endpoint OAuth Google
├── studia-video-youtube.html  # Frontend principale
├── .env.example           # Template variabili d'ambiente
├── .gitignore            # File da ignorare in Git
├── vercel.json           # Configurazione Vercel
├── package.json          # Configurazione Node.js
└── README.md            # Questo file
```

## 🔐 Sicurezza

✅ **API Keys protette**: Tutte le chiavi API sono gestite tramite variabili d'ambiente Vercel
✅ **Nessuna chiave nel codice**: Le API keys non sono mai esposte nel frontend
✅ **Serverless Functions**: Tutte le chiamate API passano attraverso funzioni serverless sicure
✅ **OAuth 2.0**: Autenticazione sicura con Google

## 🛠️ Sviluppo Locale

Per testare localmente:

```bash
# Installa Vercel CLI
npm i -g vercel

# Login
vercel login

# Link al progetto
vercel link

# Crea file .env.local con le variabili d'ambiente
cp .env.example .env.local
# Modifica .env.local con i tuoi valori

# Avvia server di sviluppo
vercel dev
```

L'app sarà disponibile su `http://localhost:3000`

## 📚 Documentazione API

### `/api/openai`
- **Method**: POST
- **Body**: `{ transcript, videoTitle, videoUrl, author, prompt }`
- **Response**: `{ success, dispensa }`

### `/api/youtube`
- **Method**: POST
- **Body**: `{ videoId }`
- **Response**: `{ success, title, author, transcript, videoId }`

### `/api/drive`
- **Method**: POST
- **Body**: `{ content, title, category, accessToken }`
- **Response**: `{ success, docUrl, docId, category }`

### `/api/gmail`
- **Method**: POST
- **Body**: `{ docUrl, videoUrl, abstract, fileName, accessToken }`
- **Response**: `{ success, messageId }`

### `/api/sheets`
- **Method**: POST
- **Body**: `{ timestamp, title, url, docUrl, category, abstract, accessToken }`
- **Response**: `{ success, updatedRange }`

### `/api/auth`
- **GET** `?action=auth-url`: Genera URL OAuth
- **GET** `?action=callback&code=...`: Gestisce callback OAuth

## 🐛 Troubleshooting

### Errore "API key non configurata"
- Verifica che tutte le variabili d'ambiente siano configurate in Vercel
- Assicurati di aver fatto un nuovo deploy dopo aver aggiunto le variabili

### Errore OAuth "redirect_uri_mismatch"
- Verifica che il redirect URI in Google Cloud Console corrisponda esattamente a quello in Vercel
- Assicurati che `GOOGLE_REDIRECT_URI` in Vercel sia corretto

### Errore CORS
- Le API routes sono già configurate con CORS in `vercel.json`
- Se persistono problemi, verifica le impostazioni del browser

## 📝 Note

- Le API keys sono visibili solo nel backend (Vercel Functions)
- Il frontend non ha mai accesso diretto alle API keys
- Per produzione, considera di aggiungere rate limiting
- Monitora l'uso delle API per evitare costi inaspettati

## 📄 Licenza

MIT

## 🤝 Supporto

Per problemi o domande, consulta la [Guida Attivazione API](./GUIDA_ATTIVAZIONE_API.md)

