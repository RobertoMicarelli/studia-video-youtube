# 🔧 Variabili d'Ambiente da Configurare in Vercel

Questa guida elenca tutte le variabili d'ambiente necessarie per il funzionamento dell'applicazione su Vercel.

## 📍 Come Aggiungere le Variabili in Vercel

1. Vai su [Vercel Dashboard](https://vercel.com/dashboard)
2. Seleziona il tuo progetto
3. Vai su **Settings** → **Environment Variables**
4. Aggiungi ogni variabile cliccando su **Add New**
5. Seleziona gli ambienti: **Production**, **Preview**, **Development**
6. Clicca su **Save**
7. **Redeploy** il progetto per applicare le modifiche

---

## 🔑 Variabili Obbligatorie

### 1. OpenAI API

| Variabile | Descrizione | Esempio | Obbligatoria |
|-----------|-------------|---------|--------------|
| `OPENAI_API_KEY` | Chiave API di OpenAI | `sk-proj-...` | ✅ Sì |
| `OPENAI_MODEL` | Modello da utilizzare | `gpt-4o` | ❌ No (default: `gpt-4o`) |
| `OPENAI_MAX_TOKENS` | Token massimi per output | `16384` | ❌ No (default: `16384` per gpt-4o, `100000` per gpt-5.2) |
| `OPENAI_TEMPERATURE` | Creatività del modello (0-1) | `0.7` | ❌ No (default: `0.7`) |

**Modelli disponibili:**
- `gpt-5.2` - **MIGLIORE per contenuti lunghi** - Contesto 400K, output fino a 128K token
- `gpt-4o` - Buona qualità, contenuti dettagliati (default)
- `gpt-4o-2024-08-06` - Versione specifica di GPT-4o
- `gpt-4o-mini` - Più economico, qualità buona ma meno dettagliata

**Costi approssimativi (per 1M token):**
- `gpt-5.2`: Input $1.75, Output $14.00 (migliore per contenuti molto lunghi)
- `gpt-4o`: Input $2.50, Output $10.00
- `gpt-4o-mini`: Input $0.15, Output $0.60

**Limiti output:**
- `gpt-5.2`: fino a 128.000 token (ideale per dispense molto dettagliate)
- `gpt-4o`: fino a 16.384 token

---

### 2. YouTube API

| Variabile | Descrizione | Esempio | Obbligatoria |
|-----------|-------------|---------|--------------|
| `YOUTUBE_API_KEY` | Chiave API di YouTube Data API v3 | `AIza...` | ✅ Sì |

**Come ottenerla:**
1. Vai su [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un progetto o seleziona uno esistente
3. Abilita **YouTube Data API v3**
4. Vai su **Credenziali** → **Crea credenziali** → **Chiave API**
5. Copia la chiave API

---

### 3. Google OAuth 2.0 (Autenticazione)

| Variabile | Descrizione | Esempio | Obbligatoria |
|-----------|-------------|---------|--------------|
| `GOOGLE_CLIENT_ID` | Client ID OAuth 2.0 | `123456789-abc...apps.googleusercontent.com` | ✅ Sì |
| `GOOGLE_CLIENT_SECRET` | Client Secret OAuth 2.0 | `GOCSPX-...` | ✅ Sì |
| `GOOGLE_REDIRECT_URI` | URI di redirect OAuth | `https://tuo-progetto.vercel.app/api/auth?action=callback` | ✅ Sì |

**Come ottenerle:**
1. Vai su [Google Cloud Console](https://console.cloud.google.com/)
2. Seleziona il progetto
3. Vai su **API e servizi** → **Credenziali**
4. Crea **ID client OAuth 2.0**
5. Tipo applicazione: **Applicazione Web**
6. URI di reindirizzamento autorizzati: `https://tuo-progetto.vercel.app/api/auth?action=callback`
7. Copia **ID client** e **Segreto client**

**⚠️ IMPORTANTE:** L'URI di redirect deve corrispondere esattamente a quello configurato in Google Cloud Console!

---

### 4. Google Drive

| Variabile | Descrizione | Esempio | Obbligatoria |
|-----------|-------------|---------|--------------|
| `GOOGLE_DRIVE_FOLDER_ID` | ID della cartella principale in Google Drive | `1nhFM1-c2lG9xKPdMjQfLPqU6jtofrRRH` | ✅ Sì |

**Come ottenerlo:**
1. Apri Google Drive
2. Crea o seleziona la cartella principale dove salvare i documenti
3. Apri la cartella
4. Copia l'ID dall'URL: `https://drive.google.com/drive/folders/`**`1nhFM1-c2lG9xKPdMjQfLPqU6jtofrRRH`**

**Nota:** Le sottocartelle per categoria verranno create automaticamente all'interno di questa cartella.

---

### 5. Google Sheets

| Variabile | Descrizione | Esempio | Obbligatoria |
|-----------|-------------|---------|--------------|
| `GOOGLE_SHEETS_ID` | ID del foglio di calcolo Google Sheets | `1abc123def456ghi789jkl012mno345pq` | ✅ Sì |

**Come ottenerlo:**
1. Crea un nuovo Google Sheets o apri quello esistente
2. Copia l'ID dall'URL: `https://docs.google.com/spreadsheets/d/`**`1abc123def456ghi789jkl012mno345pq`**`/edit`

**Struttura del foglio:**
Il foglio deve avere queste colonne (in ordine):
1. Timestamp
2. Titolo
3. URL Video
4. URL Documento
5. Categoria
6. Abstract

---

### 6. Gmail (Email di Notifica)

| Variabile | Descrizione | Esempio | Obbligatoria |
|-----------|-------------|---------|--------------|
| `NOTIFICATION_EMAIL` | Email dove inviare le notifiche | `roberto.micarelli@gmail.com` | ❌ No (default: `roberto.micarelli@gmail.com`) |

**Nota:** L'email deve essere autorizzata tramite OAuth 2.0 quando l'utente si autentica con Google.

---

## 📋 Riepilogo Completo

### Variabili Obbligatorie (9)

```
OPENAI_API_KEY=sk-proj-...
YOUTUBE_API_KEY=AIza...
GOOGLE_CLIENT_ID=123456789-abc...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
GOOGLE_REDIRECT_URI=https://tuo-progetto.vercel.app/api/auth?action=callback
GOOGLE_DRIVE_FOLDER_ID=1nhFM1-c2lG9xKPdMjQfLPqU6jtofrRRH
GOOGLE_SHEETS_ID=1abc123def456ghi789jkl012mno345pq
```

### Variabili Opzionali (4)

```
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=16000
OPENAI_TEMPERATURE=0.7
NOTIFICATION_EMAIL=roberto.micarelli@gmail.com
```

---

## ⚙️ Configurazioni Consigliate

### Per Contenuti Molto Dettagliati e Lunghi (MIGLIORE - Consigliato)
```
OPENAI_MODEL=gpt-5.2
OPENAI_MAX_TOKENS=100000
OPENAI_TEMPERATURE=0.7
```

### Per Contenuti di Alta Qualità (Alternativa)
```
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=16384
OPENAI_TEMPERATURE=0.7
```

### Per Risparmiare sui Costi
```
OPENAI_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=12000
OPENAI_TEMPERATURE=0.7
```

### Per Contenuti Molto Dettagliati
```
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=20000
OPENAI_TEMPERATURE=0.7
```

---

## 🔍 Verifica Configurazione

Dopo aver configurato le variabili, puoi verificare la configurazione OAuth visitando:
```
https://tuo-progetto.vercel.app/api/auth?action=debug
```

Questo endpoint mostra (senza esporre valori sensibili):
- Se `GOOGLE_CLIENT_ID` è configurato
- Se `GOOGLE_CLIENT_SECRET` è configurato
- Se `GOOGLE_REDIRECT_URI` è configurato
- L'URI di redirect attuale

---

## ⚠️ Note Importanti

1. **Sicurezza**: Non condividere mai le chiavi API pubblicamente
2. **Redeploy**: Dopo aver aggiunto/modificato variabili, fai un redeploy del progetto
3. **Ambienti**: Configura le variabili per Production, Preview e Development
4. **Google OAuth**: Assicurati che l'URI di redirect corrisponda esattamente
5. **Permessi**: Assicurati che l'account Google abbia i permessi necessari per Drive, Sheets e Gmail

---

## 🆘 Troubleshooting

### Errore "invalid_client" durante OAuth
- Verifica che `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` siano corretti
- Verifica che `GOOGLE_REDIRECT_URI` corrisponda esattamente a quello in Google Cloud Console
- Assicurati che l'app OAuth sia pubblicata o che il tuo account sia nella lista utenti di test

### Errore "API key non configurata"
- Verifica che tutte le variabili obbligatorie siano configurate
- Fai un redeploy dopo aver aggiunto le variabili
- Controlla che le variabili siano configurate per l'ambiente corretto (Production/Preview/Development)

### Contenuti troppo ridotti
- Aumenta `OPENAI_MAX_TOKENS` (es. 20000)
- Cambia `OPENAI_MODEL` a `gpt-4o` se stai usando `gpt-4o-mini`
- Verifica che la trascrizione sia completa

