# 🚀 Guida Completa: Deploy su Vercel tramite GitHub

Questa guida ti accompagna passo dopo passo nel deployment dell'app su Vercel **tramite GitHub**, con tutte le API keys protette tramite variabili d'ambiente.

---

## ✅ Checklist Pre-Deployment

Prima di iniziare, assicurati di avere:

- [ ] Account GitHub
- [ ] Account Vercel (gratuito)
- [ ] Tutte le API configurate (vedi `GUIDA_ATTIVAZIONE_API.md`)
- [ ] Git installato sul tuo computer
- [ ] Tutte le variabili d'ambiente pronte (chiavi API, ID, ecc.)

---

## 📦 Step 1: Preparare il Repository GitHub

### 1.1 Inizializza Git (se non già fatto)

Apri il terminale nella cartella del progetto:

```bash
cd "/Users/robertomicarelli/Desktop/CURSOR.AI/STUDIA DA VIDEO YOUTUBE"
```

Se non hai ancora inizializzato Git:

```bash
git init
```

### 1.2 Verifica che .gitignore sia presente

Il file `.gitignore` è già configurato per escludere:
- File `.env` e `.env.local` (le tue API keys)
- `node_modules/`
- File temporanei

**IMPORTANTE**: Verifica che `.env.local` non venga committato!

```bash
# Verifica che .env.local sia ignorato
git status
# Non dovrebbe apparire .env.local nell'elenco
```

### 1.3 Aggiungi tutti i file al repository

```bash
# Aggiungi tutti i file (tranne quelli in .gitignore)
git add .

# Verifica cosa verrà committato
git status
```

⚠️ **VERIFICA**: Assicurati che NON ci siano file `.env` o `.env.local` nell'elenco!

### 1.4 Crea il primo commit

```bash
git commit -m "Initial commit: Studia Video YouTube app con Vercel Functions"
```

### 1.5 Crea il repository su GitHub

1. Vai su https://github.com
2. Accedi al tuo account
3. Clicca su **"+"** in alto a destra > **"New repository"**
4. Compila il form:
   - **Repository name**: `studia-video-youtube` (o altro nome)
   - **Description**: "App per trasformare video YouTube in dispense didattiche"
   - **Visibility**: 
     - ✅ **Private** (consigliato se contiene informazioni sensibili)
     - Oppure **Public** (se vuoi condividerlo)
   - ❌ **NON** selezionare "Add a README file" (lo abbiamo già)
   - ❌ **NON** selezionare "Add .gitignore" (lo abbiamo già)
5. Clicca **"Create repository"**

### 1.6 Collega il repository locale a GitHub

GitHub ti mostrerà le istruzioni. Usa queste (sostituisci `TUO_USERNAME`):

```bash
# Aggiungi il remote (sostituisci TUO_USERNAME con il tuo username GitHub)
git remote add origin https://github.com/TUO_USERNAME/studia-video-youtube.git

# Rinomina il branch principale
git branch -M main

# Fai il push del codice
git push -u origin main
```

Se ti chiede credenziali:
- Username: il tuo username GitHub
- Password: usa un **Personal Access Token** (non la password normale)
  - Vai su GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)
  - Genera un nuovo token con permessi `repo`
  - Usa quel token come password

---

## 🔗 Step 2: Collegare GitHub a Vercel

### 2.1 Crea account Vercel (se non l'hai già)

1. Vai su https://vercel.com
2. Clicca **"Sign Up"**
3. Seleziona **"Continue with GitHub"**
4. Autorizza Vercel ad accedere al tuo account GitHub

### 2.2 Importa il repository

1. Nel dashboard Vercel, clicca **"Add New..."** > **"Project"**
2. Seleziona **"Import Git Repository"**
3. Cerca e seleziona il repository `studia-video-youtube`
4. Clicca **"Import"**

### 2.3 Configura il progetto

Vercel rileverà automaticamente la configurazione da `vercel.json`. Verifica:

- **Framework Preset**: Dovrebbe essere "Other" o rilevato automaticamente
- **Root Directory**: `./` (lasciare così)
- **Build Command**: (lasciare vuoto o rimuovere)
- **Output Directory**: (lasciare vuoto)

⚠️ **NON fare ancora il deploy!** Prima dobbiamo configurare le variabili d'ambiente.

---

## 🔐 Step 3: Configurare le Variabili d'Ambiente in Vercel

### 3.1 Vai alle Environment Variables

1. Nella pagina di configurazione del progetto, scorri fino a **"Environment Variables"**
2. Oppure dopo il deploy, vai su **"Settings"** > **"Environment Variables"**

### 3.2 Aggiungi tutte le variabili

Aggiungi una per una tutte queste variabili. Per ogni variabile:

1. Clicca **"Add New"**
2. Inserisci **Key** e **Value**
3. Seleziona gli ambienti: ✅ Production, ✅ Preview, ✅ Development
4. Clicca **"Save"**

#### Variabili OpenAI

```
Key: OPENAI_API_KEY
Value: sk-proj-... (la tua chiave OpenAI)
Environments: ✅ Production, ✅ Preview, ✅ Development
```

```
Key: OPENAI_MODEL
Value: gpt-4o-mini
Environments: ✅ Production, ✅ Preview, ✅ Development
```

```
Key: OPENAI_MAX_TOKENS
Value: 8000
Environments: ✅ Production, ✅ Preview, ✅ Development
```

```
Key: OPENAI_TEMPERATURE
Value: 0.7
Environments: ✅ Production, ✅ Preview, ✅ Development
```

#### Variabile YouTube

```
Key: YOUTUBE_API_KEY
Value: AIzaSy... (la tua chiave YouTube)
Environments: ✅ Production, ✅ Preview, ✅ Development
```

#### Variabili Google OAuth

```
Key: GOOGLE_CLIENT_ID
Value: xxxxxx-xxxxx.apps.googleusercontent.com
Environments: ✅ Production, ✅ Preview, ✅ Development
```

```
Key: GOOGLE_CLIENT_SECRET
Value: GOCSPX-xxxxx
Environments: ✅ Production, ✅ Preview, ✅ Development
```

```
Key: GOOGLE_REDIRECT_URI
Value: https://tuodominio.vercel.app/api/auth?action=callback
Environments: ✅ Production, ✅ Preview, ✅ Development
```

⚠️ **IMPORTANTE**: Per `GOOGLE_REDIRECT_URI`, usa un placeholder per ora. Lo aggiornerai dopo il primo deploy con il dominio reale!

#### Variabile Google Drive

```
Key: GOOGLE_DRIVE_FOLDER_ID
Value: 1nhFM1-c2lG9xKPdMjQfLPqU6jtofrRRH
Environments: ✅ Production, ✅ Preview, ✅ Development
```
(Sostituisci con l'ID della tua cartella)

#### Variabile Google Sheets

```
Key: GOOGLE_SHEETS_ID
Value: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Environments: ✅ Production, ✅ Preview, ✅ Development
```
(Sostituisci con l'ID del tuo foglio)

#### Variabile Email

```
Key: NOTIFICATION_EMAIL
Value: roberto.micarelli@gmail.com
Environments: ✅ Production, ✅ Preview, ✅ Development
```
(Sostituisci con la tua email)

### 3.3 Verifica tutte le variabili

Dovresti avere **11 variabili** in totale. Controlla che siano tutte presenti.

---

## 🚀 Step 4: Fare il Deploy

### 4.1 Deploy iniziale

1. Nella pagina di configurazione del progetto Vercel
2. Clicca **"Deploy"**
3. ⏳ Attendi il completamento (circa 1-2 minuti)

### 4.2 Ottieni il dominio Vercel

Dopo il deploy, Vercel ti assegnerà un dominio:
- Esempio: `studia-video-youtube-abc123.vercel.app`
- Oppure un dominio personalizzato se lo hai configurato

**COPIA questo dominio** - ti servirà per i prossimi passi!

---

## 🔄 Step 5: Aggiornare Google OAuth con il Dominio Vercel

### 5.1 Aggiorna la variabile in Vercel

1. Vai su Vercel > **Settings** > **Environment Variables**
2. Trova `GOOGLE_REDIRECT_URI`
3. Clicca sull'icona di modifica (matita)
4. Aggiorna il valore con il dominio reale:
   ```
   https://tuodominio.vercel.app/api/auth?action=callback
   ```
   (Sostituisci `tuodominio` con il dominio Vercel assegnato)
5. Clicca **"Save"**

### 5.2 Aggiorna Google Cloud Console

1. Vai su https://console.cloud.google.com/
2. **"API e servizi"** > **"Credenziali"**
3. Clicca sul tuo **"ID client OAuth"**
4. In **"Origini JavaScript autorizzate"**, aggiungi:
   - `https://tuodominio.vercel.app`
5. In **"URI di reindirizzamento autorizzati"**, aggiungi:
   - `https://tuodominio.vercel.app/api/auth?action=callback`
6. Clicca **"Salva"**

### 5.3 Nuovo Deploy

Dopo aver aggiornato le variabili, fai un nuovo deploy:

1. Vai su Vercel > **Deployments**
2. Clicca sui tre puntini del deployment più recente
3. Clicca **"Redeploy"**
4. Oppure fai un nuovo commit e push su GitHub (deploy automatico)

---

## ✅ Step 6: Test dell'Applicazione

### 6.1 Apri l'app

1. Vai sul dominio Vercel (es. `https://studia-video-youtube.vercel.app`)
2. Dovresti vedere l'interfaccia dell'app

### 6.2 Test autenticazione Google

1. Clicca **"Accedi con Google"**
2. Autorizza l'app con il tuo account Google
3. Dovresti essere reindirizzato indietro all'app
4. Il banner dovrebbe mostrare "✅ Autenticato con Google"

### 6.3 Test generazione dispensa

1. Inserisci un URL YouTube valido (usa un video breve per il primo test)
2. Clicca **"Genera Dispensa"**
3. Attendi il completamento del processo
4. Verifica i risultati:
   - ✅ Controlla Google Drive: dovrebbe esserci un nuovo documento
   - ✅ Controlla email: dovresti ricevere una notifica
   - ✅ Controlla Google Sheets: dovrebbe esserci una nuova riga

---

## 🔄 Step 7: Deploy Automatici Futuri

D'ora in poi, ogni volta che fai push su GitHub, Vercel farà automaticamente un nuovo deploy:

```bash
# Fai le tue modifiche
# ...

# Commit e push
git add .
git commit -m "Descrizione delle modifiche"
git push
```

Vercel rileverà automaticamente il push e farà un nuovo deploy!

---

## 🐛 Troubleshooting

### Errore: "API key non configurata"

**Causa**: Variabile d'ambiente mancante o non configurata correttamente.

**Soluzione**:
1. Vai su Vercel > Settings > Environment Variables
2. Verifica che tutte le variabili siano presenti
3. Assicurati che siano applicate agli ambienti corretti (Production, Preview, Development)
4. Fai un nuovo deploy dopo aver aggiunto/modificato variabili

### Errore: "redirect_uri_mismatch"

**Causa**: Il redirect URI in Google Cloud Console non corrisponde a quello in Vercel.

**Soluzione**:
1. Verifica che `GOOGLE_REDIRECT_URI` in Vercel sia esattamente:
   ```
   https://tuodominio.vercel.app/api/auth?action=callback
   ```
2. Verifica che in Google Cloud Console sia identico
3. Assicurati che non ci siano spazi o caratteri extra
4. Fai un nuovo deploy dopo le modifiche

### Il deploy fallisce

**Causa**: Problema con la configurazione o il codice.

**Soluzione**:
1. Controlla i log di Vercel: Deployments > [deployment] > "Build Logs"
2. Verifica che `vercel.json` sia presente e corretto
3. Verifica che tutti i file necessari siano nel repository
4. Controlla che non ci siano errori di sintassi nel codice

### Le API routes non funzionano

**Causa**: Problema con la configurazione Vercel.

**Soluzione**:
1. Verifica i log: Deployments > [deployment] > "Functions"
2. Controlla che i file siano nella cartella `/api/`
3. Verifica che `vercel.json` sia presente
4. Controlla che le variabili d'ambiente siano configurate

---

## 📊 Monitoraggio

### Log di Vercel

1. Vai su Vercel Dashboard
2. Seleziona il progetto
3. Vai su **"Deployments"** > [deployment] > **"Functions"**
4. Qui puoi vedere i log delle API routes

### Deploy Status

Nel dashboard Vercel puoi vedere:
- Stato di ogni deploy (Building, Ready, Error)
- Tempo di build
- Log di build e runtime

---

## 🔒 Sicurezza

✅ **Best Practices Implementate**:

1. **API Keys nel Backend**: Tutte le chiavi API sono gestite solo nelle Vercel Functions
2. **Nessuna Chiave nel Codice**: Il codice su GitHub non contiene mai API keys
3. **Variabili d'Ambiente**: Tutte le configurazioni sensibili sono in variabili d'ambiente Vercel
4. **Gitignore**: File `.env` esclusi da Git
5. **OAuth 2.0**: Autenticazione sicura con Google

---

## 📚 Risorse Utili

- [Documentazione Vercel](https://vercel.com/docs)
- [Vercel GitHub Integration](https://vercel.com/docs/concepts/git)
- [GitHub Docs](https://docs.github.com/)

---

## ✅ Checklist Completa

- [ ] Repository GitHub creato
- [ ] Codice pushato su GitHub
- [ ] Vercel collegato a GitHub
- [ ] Tutte le variabili d'ambiente configurate in Vercel
- [ ] Primo deploy completato
- [ ] Dominio Vercel ottenuto
- [ ] Google OAuth aggiornato con dominio reale
- [ ] Nuovo deploy dopo aggiornamento OAuth
- [ ] Test autenticazione Google completato
- [ ] Test generazione dispensa completato
- [ ] Verificato salvataggio su Drive
- [ ] Verificato invio email
- [ ] Verificato aggiornamento Sheets

---

**Deploy completato! 🎉**

L'app è ora live su Vercel e si aggiornerà automaticamente ad ogni push su GitHub!

