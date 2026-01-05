# 🧪 Guida: Test in Locale

Questa guida ti spiega come testare l'app in locale prima di fare il deploy su Vercel.

---

## 📋 Prerequisiti

- Node.js 18+ installato
- Vercel CLI installato
- Tutte le API configurate (OpenAI, Google Cloud)

---

## 🔧 Step 1: Installa Vercel CLI

Se non l'hai già installato:

```bash
npm install -g vercel
```

Verifica l'installazione:
```bash
vercel --version
```

---

## 📝 Step 2: Crea il file .env.local

1. **Copia il file di esempio**:
   ```bash
   cp .env.example .env.local
   ```

2. **Apri il file `.env.local`** con un editor di testo

3. **Compila tutte le variabili** con i tuoi valori reali:

```env
# ============================================
# OPENAI API
# ============================================
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=8000
OPENAI_TEMPERATURE=0.7

# ============================================
# YOUTUBE DATA API v3
# ============================================
YOUTUBE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ============================================
# GOOGLE OAUTH 2.0
# ============================================
GOOGLE_CLIENT_ID=xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth?action=callback

# ============================================
# GOOGLE DRIVE
# ============================================
GOOGLE_DRIVE_FOLDER_ID=1nhFM1-c2lG9xKPdMjQfLPqU6jtofrRRH

# ============================================
# GOOGLE SHEETS
# ============================================
GOOGLE_SHEETS_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ============================================
# EMAIL NOTIFICHE
# ============================================
NOTIFICATION_EMAIL=roberto.micarelli@gmail.com
```

⚠️ **IMPORTANTE**: 
- Sostituisci tutti i valori `xxxxx` con i tuoi valori reali
- Per `GOOGLE_REDIRECT_URI` usa `http://localhost:3000` (non `https://`)
- **NON committare mai** il file `.env.local` su GitHub (è già nel `.gitignore`)

---

## 🔗 Step 3: Configura Google OAuth per Localhost

Prima di testare, devi aggiungere localhost agli URI autorizzati in Google Cloud Console:

1. Vai su https://console.cloud.google.com/
2. **"API e servizi"** > **"Credenziali"**
3. Clicca sul tuo **"ID client OAuth"**
4. In **"Origini JavaScript autorizzate"**, aggiungi:
   - `http://localhost:3000`
5. In **"URI di reindirizzamento autorizzati"**, aggiungi:
   - `http://localhost:3000/api/auth?action=callback`
6. Clicca **"Salva"**

---

## 🚀 Step 4: Avvia il Server Locale

1. **Apri il terminale** nella cartella del progetto:
   ```bash
   cd "/Users/robertomicarelli/Desktop/CURSOR.AI/STUDIA DA VIDEO YOUTUBE"
   ```

2. **Collega il progetto a Vercel** (solo la prima volta):
   ```bash
   vercel link
   ```
   - Ti chiederà se vuoi collegare a un progetto esistente o crearne uno nuovo
   - Scegli "Link to existing project" se hai già creato il progetto su Vercel
   - Oppure "Create new project" se è la prima volta

3. **Avvia il server di sviluppo**:
   ```bash
   vercel dev
   ```
   
   Oppure usa lo script npm:
   ```bash
   npm run dev
   ```

4. **Attendi** che Vercel avvii il server. Vedrai un output simile a:
   ```
   > Ready! Available at http://localhost:3000
   ```

---

## 🌐 Step 5: Testa l'Applicazione

1. **Apri il browser** e vai su:
   ```
   http://localhost:3000
   ```

2. **Testa l'autenticazione Google**:
   - Clicca "Accedi con Google"
   - Autorizza l'app
   - Dovresti essere reindirizzato indietro all'app

3. **Testa la generazione di una dispensa**:
   - Inserisci un URL YouTube (es. un video breve per test)
   - Clicca "Genera Dispensa"
   - Attendi il completamento

4. **Verifica i risultati**:
   - Controlla che il documento sia stato creato su Google Drive
   - Controlla che l'email sia stata inviata
   - Controlla che Google Sheets sia stato aggiornato

---

## 🐛 Troubleshooting

### Errore: "API key non configurata"

**Causa**: Le variabili d'ambiente non vengono lette correttamente.

**Soluzione**:
1. Verifica che il file si chiami esattamente `.env.local` (non `.env` o altro)
2. Verifica che tutte le variabili siano presenti
3. Riavvia il server (`Ctrl+C` e poi `vercel dev` di nuovo)
4. Verifica che non ci siano spazi prima o dopo i valori

### Errore: "redirect_uri_mismatch"

**Causa**: Localhost non è configurato in Google Cloud Console.

**Soluzione**:
1. Vai su Google Cloud Console > Credenziali
2. Aggiungi `http://localhost:3000/api/auth?action=callback` agli URI autorizzati
3. Salva e riprova

### Errore: "Cannot find module"

**Causa**: Dipendenze non installate.

**Soluzione**:
```bash
npm install
```

### Il server non si avvia

**Causa**: Porta 3000 già in uso.

**Soluzione**:
1. Chiudi altri processi sulla porta 3000
2. Oppure Vercel userà automaticamente un'altra porta (es. 3001)

---

## 📊 Verifica Variabili d'Ambiente

Per verificare che le variabili siano caricate correttamente, puoi aggiungere temporaneamente questo nel codice (rimuovilo dopo):

In `api/openai.js`, aggiungi temporaneamente:
```javascript
console.log('OPENAI_API_KEY presente:', !!process.env.OPENAI_API_KEY);
```

Poi controlla i log nel terminale quando fai una richiesta.

---

## ✅ Checklist Test Locale

- [ ] Vercel CLI installato
- [ ] File `.env.local` creato e compilato
- [ ] Google OAuth configurato per localhost
- [ ] Server locale avviato (`vercel dev`)
- [ ] App accessibile su `http://localhost:3000`
- [ ] Autenticazione Google funzionante
- [ ] Test generazione dispensa completato
- [ ] Verificato salvataggio su Drive
- [ ] Verificato invio email
- [ ] Verificato aggiornamento Sheets

---

## 🚀 Dopo il Test Locale

Una volta che tutto funziona in locale:

1. **Fai il deploy su Vercel**:
   ```bash
   git add .
   git commit -m "Ready for production"
   git push
   ```

2. **Configura le variabili d'ambiente in Vercel** (vedi `DEPLOYMENT_VERCEL.md`)

3. **Aggiorna Google OAuth** con il dominio Vercel reale

---

## 💡 Note Utili

- Il file `.env.local` è già nel `.gitignore`, quindi non verrà committato
- Per produzione, usa sempre le variabili d'ambiente di Vercel
- Puoi avere variabili diverse per locale e produzione
- Vercel CLI legge automaticamente `.env.local` in sviluppo

---

**Buon test! 🎉**

