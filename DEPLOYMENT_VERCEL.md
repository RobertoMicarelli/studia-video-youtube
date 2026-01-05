# 🚀 Guida Completa: Deployment su Vercel

Questa guida ti accompagna passo dopo passo nel deployment dell'app su Vercel tramite GitHub, con tutte le API keys protette tramite variabili d'ambiente.

---

## ✅ Checklist Pre-Deployment

Prima di iniziare, assicurati di avere:

- [ ] Account GitHub
- [ ] Account Vercel (gratuito)
- [ ] Account OpenAI con API key
- [ ] Account Google Cloud con progetto configurato
- [ ] Tutte le API abilitate (vedi `GUIDA_ATTIVAZIONE_API.md`)

---

## 📦 Step 1: Preparare il Repository GitHub

### 1.1 Inizializza Git (se non già fatto)

```bash
cd "/Users/robertomicarelli/Desktop/CURSOR.AI/STUDIA DA VIDEO YOUTUBE"
git init
```

### 1.2 Crea .gitignore (già presente)

Il file `.gitignore` è già configurato per escludere:
- File `.env` e `.env.local`
- `node_modules/`
- File temporanei

### 1.3 Commit e Push su GitHub

```bash
# Aggiungi tutti i file
git add .

# Commit iniziale
git commit -m "Initial commit: Studia Video YouTube app con Vercel Functions"

# Crea repository su GitHub (vai su github.com e crea un nuovo repo)
# Poi aggiungi il remote:
git remote add origin https://github.com/TUO_USERNAME/studia-video-youtube.git
git branch -M main
git push -u origin main
```

**⚠️ IMPORTANTE**: Non committare mai file `.env` o `.env.local` con API keys reali!

---

## 🔧 Step 2: Configurare Vercel

### 2.1 Crea Account e Importa Repository

1. Vai su https://vercel.com
2. Clicca "Sign Up" e accedi con GitHub
3. Clicca "New Project"
4. Seleziona il repository `studia-video-youtube`
5. Vercel rileverà automaticamente la configurazione da `vercel.json`

### 2.2 Configura le Variabili d'Ambiente

Nel pannello "Environment Variables" di Vercel, aggiungi tutte queste variabili:

#### 🔑 OpenAI API

```
OPENAI_API_KEY = sk-proj-... (la tua chiave OpenAI)
OPENAI_MODEL = gpt-4o-mini
OPENAI_MAX_TOKENS = 4000
OPENAI_TEMPERATURE = 0.7
```

**Dove trovare**: https://platform.openai.com/api-keys

#### 🎬 YouTube Data API

```
YOUTUBE_API_KEY = AIzaSy... (la tua chiave YouTube)
```

**Dove trovare**: Google Cloud Console > APIs & Services > Credentials

#### 🔐 Google OAuth 2.0

```
GOOGLE_CLIENT_ID = xxxxxx-xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = GOCSPX-xxxxx
GOOGLE_REDIRECT_URI = https://tuodominio.vercel.app/api/auth?action=callback
```

**⚠️ IMPORTANTE**: 
- Il `GOOGLE_REDIRECT_URI` va aggiornato DOPO il primo deploy quando Vercel assegna il dominio
- Per ora puoi lasciare un placeholder, lo aggiorneremo dopo

**Dove trovare**: Google Cloud Console > APIs & Services > Credentials > OAuth 2.0 Client ID

#### 📁 Google Drive

```
GOOGLE_DRIVE_FOLDER_ID = 1nhFM1-c2lG9xKPdMjQfLPqU6jtofrRRH
```

**Come ottenere**:
1. Vai su Google Drive
2. Crea/apri la cartella dove salvare i documenti
3. Clicca con tasto destro > "Ottieni link"
4. Copia l'ID dalla URL: `https://drive.google.com/drive/folders/FOLDER_ID`

#### 📊 Google Sheets

```
GOOGLE_SHEETS_ID = xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Come ottenere**:
1. Crea un nuovo Google Sheet
2. Aggiungi intestazioni: `Timestamp | Titolo | URL Video | URL Documento | Categoria | Abstract`
3. Clicca "Condividi" > "Ottieni link" > "Chiunque con il link può modificare"
4. Copia l'ID dalla URL: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`

#### 📧 Email Notifiche

```
NOTIFICATION_EMAIL = roberto.micarelli@gmail.com
```

### 2.3 Deploy Iniziale

1. Clicca "Deploy"
2. Attendi il completamento (circa 1-2 minuti)
3. Vercel ti assegnerà un dominio (es. `studia-video-youtube-abc123.vercel.app`)

---

## 🔄 Step 3: Aggiornare Google OAuth Redirect URI

Dopo il primo deploy, Vercel ti assegna un dominio. Devi aggiornare il redirect URI in Google Cloud Console.

### 3.1 Ottieni il Dominio Vercel

Dopo il deploy, Vercel mostra il dominio (es. `studia-video-youtube.vercel.app`)

### 3.2 Aggiorna Google Cloud Console

1. Vai su https://console.cloud.google.com/apis/credentials
2. Apri le tue credenziali OAuth 2.0 Client ID
3. Nella sezione "Authorized redirect URIs", aggiungi:
   ```
   https://tuodominio.vercel.app/api/auth?action=callback
   ```
   (Sostituisci `tuodominio` con il dominio Vercel assegnato)
4. Clicca "Save"

### 3.3 Aggiorna Variabile Vercel

1. Vai su Vercel > Settings > Environment Variables
2. Trova `GOOGLE_REDIRECT_URI`
3. Modifica il valore con il dominio corretto:
   ```
   https://tuodominio.vercel.app/api/auth?action=callback
   ```
4. Salva

### 3.4 Nuovo Deploy

1. Vai su Vercel > Deployments
2. Clicca sui tre puntini del deployment più recente
3. Clicca "Redeploy"
4. Oppure fai un nuovo commit e push su GitHub (deploy automatico)

---

## ✅ Step 4: Test dell'Applicazione

### 4.1 Test Autenticazione Google

1. Apri l'URL Vercel (es. `https://studia-video-youtube.vercel.app`)
2. Dovresti vedere un banner con "⚠️ Autenticazione Google richiesta"
3. Clicca "Accedi con Google"
4. Autorizza l'app con il tuo account Google
5. Dopo l'autorizzazione, verrai reindirizzato all'app con token salvato
6. Il banner dovrebbe mostrare "✅ Autenticato con Google"

### 4.2 Test Generazione Dispensa

1. Inserisci un URL YouTube valido
2. Clicca "Genera Dispensa"
3. Attendi il completamento del processo:
   - ✅ Estrazione trascrizione
   - ✅ Elaborazione OpenAI
   - ✅ Salvataggio su Google Drive
   - ✅ Invio email
   - ✅ Aggiornamento Google Sheets

### 4.3 Verifica Risultati

- ✅ Controlla Google Drive: dovrebbe esserci un nuovo documento
- ✅ Controlla email: dovresti ricevere una notifica
- ✅ Controlla Google Sheets: dovrebbe esserci una nuova riga

---

## 🐛 Troubleshooting

### Errore: "API key non configurata"

**Causa**: Variabile d'ambiente mancante o non configurata correttamente.

**Soluzione**:
1. Vai su Vercel > Settings > Environment Variables
2. Verifica che tutte le variabili siano presenti
3. Assicurati di aver fatto un nuovo deploy dopo aver aggiunto le variabili
4. Le variabili aggiunte dopo il deploy non sono attive fino al prossimo deploy

### Errore: "redirect_uri_mismatch"

**Causa**: Il redirect URI in Google Cloud Console non corrisponde a quello in Vercel.

**Soluzione**:
1. Verifica che il redirect URI in Google Cloud Console sia esattamente:
   ```
   https://tuodominio.vercel.app/api/auth?action=callback
   ```
2. Verifica che `GOOGLE_REDIRECT_URI` in Vercel sia identico
3. Assicurati che non ci siano spazi o caratteri extra
4. Fai un nuovo deploy dopo le modifiche

### Errore: "CORS policy"

**Causa**: Problema con le policy CORS.

**Soluzione**:
- Le API routes sono già configurate con CORS in `vercel.json`
- Se persistono problemi, verifica che stai usando il dominio Vercel corretto
- Controlla la console del browser per dettagli sull'errore

### Errore: "Google Drive API error: insufficient permissions"

**Causa**: L'utente non ha autorizzato i permessi necessari.

**Soluzione**:
1. Disconnetti e riconnetti con Google
2. Assicurati di autorizzare tutti i permessi richiesti:
   - Google Drive
   - Gmail
   - Google Sheets

### Le API routes non funzionano

**Causa**: Problema con la configurazione Vercel.

**Soluzione**:
1. Verifica che `vercel.json` sia presente e corretto
2. Controlla i log di Vercel: Vercel Dashboard > Deployments > [deployment] > Functions
3. Verifica che le funzioni siano nella cartella `/api/`
4. Assicurati che i file abbiano estensione `.js`

---

## 🔒 Sicurezza

### ✅ Best Practices Implementate

1. **API Keys nel Backend**: Tutte le chiavi API sono gestite solo nelle Vercel Functions
2. **Nessuna Chiave nel Frontend**: Il codice HTML/JS non contiene mai API keys
3. **Variabili d'Ambiente**: Tutte le configurazioni sensibili sono in variabili d'ambiente
4. **Gitignore**: File `.env` esclusi da Git
5. **OAuth 2.0**: Autenticazione sicura con Google

### ⚠️ Note Importanti

- **Non condividere mai** le variabili d'ambiente pubblicamente
- **Non committare** file `.env` o `.env.local` su GitHub
- **Monitora l'uso** delle API per evitare costi inaspettati
- **Limita gli accessi** alle API keys in Google Cloud Console se possibile

---

## 📊 Monitoraggio

### Log di Vercel

1. Vai su Vercel Dashboard
2. Seleziona il progetto
3. Vai su "Deployments" > [deployment] > "Functions"
4. Qui puoi vedere i log delle API routes

### Monitoraggio Costi

- **OpenAI**: Monitora su https://platform.openai.com/usage
- **Google Cloud**: Monitora su https://console.cloud.google.com/billing
- **Vercel**: Tier gratuito include 100GB bandwidth/mese

---

## 🔄 Aggiornamenti Futuri

Per aggiornare l'app:

1. Modifica i file localmente
2. Commit e push su GitHub:
   ```bash
   git add .
   git commit -m "Descrizione modifiche"
   git push
   ```
3. Vercel farà automaticamente un nuovo deploy

---

## 📚 Risorse Utili

- [Documentazione Vercel](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [OpenAI API](https://platform.openai.com/docs)

---

## 🎉 Completato!

Se hai seguito tutti gli step, l'app dovrebbe essere live e funzionante su Vercel!

Per problemi o domande, consulta:
- `README.md` - Documentazione generale
- `GUIDA_ATTIVAZIONE_API.md` - Guida per attivare le API

**Buon deployment! 🚀**

