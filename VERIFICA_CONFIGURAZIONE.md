# ✅ Verifica Configurazione OAuth

## 🔍 Test Rapido

Per verificare che le variabili d'ambiente siano configurate correttamente, apri questo URL nel browser:

```
https://tuodominio.vercel.app/api/auth?action=debug
```

(Sostituisci `tuodominio` con il tuo dominio Vercel reale)

Dovresti vedere un JSON con:
- `hasClientId: true`
- `hasClientSecret: true`
- `hasRedirectUri: true`
- `redirectUri: "https://tuodominio.vercel.app/api/auth?action=callback"`

Se qualcosa è `false` o `NOT SET`, quella variabile non è configurata correttamente in Vercel.

---

## 📋 Checklist Configurazione

### ✅ In Vercel (Environment Variables)

Verifica che queste variabili siano presenti:

```
GOOGLE_CLIENT_ID = xxxxxx-xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = GOCSPX-xxxxx
GOOGLE_REDIRECT_URI = https://tuodominio.vercel.app/api/auth?action=callback
```

**IMPORTANTE**:
- Sostituisci `tuodominio` con il tuo dominio Vercel reale
- Non ci devono essere spazi prima o dopo i valori
- Non usare virgolette nei valori
- Le variabili devono essere applicate a Production, Preview e Development

### ✅ In Google Cloud Console

1. Vai su https://console.cloud.google.com/
2. **"API e servizi"** > **"Credenziali"**
3. Clicca sul tuo **"ID client OAuth"**
4. Verifica:
   - **ID client** corrisponde a `GOOGLE_CLIENT_ID` in Vercel
   - **Segreto client** corrisponde a `GOOGLE_CLIENT_SECRET` in Vercel
   - **URI di reindirizzamento autorizzati** contiene esattamente:
     ```
     https://tuodominio.vercel.app/api/auth?action=callback
     ```

**IMPORTANTE**:
- L'URI deve essere identico in entrambi i posti
- Deve iniziare con `https://` (non `http://`)
- Deve finire con `/api/auth?action=callback`
- Non ci devono essere spazi

---

## 🔧 Come Correggere

### Se `hasClientId: false`

1. Vai su Vercel > Settings > Environment Variables
2. Aggiungi `GOOGLE_CLIENT_ID` con il valore corretto
3. Fai un nuovo deploy

### Se `hasClientSecret: false`

1. Vai su Vercel > Settings > Environment Variables
2. Aggiungi `GOOGLE_CLIENT_SECRET` con il valore corretto
3. Fai un nuovo deploy

### Se `hasRedirectUri: false` o `redirectUri` è sbagliato

1. Ottieni il tuo dominio Vercel (es. `studia-video-youtube-abc123.vercel.app`)
2. Vai su Vercel > Settings > Environment Variables
3. Aggiorna `GOOGLE_REDIRECT_URI` con:
   ```
   https://tuodominio.vercel.app/api/auth?action=callback
   ```
4. Vai su Google Cloud Console > Credenziali > ID client OAuth
5. Aggiorna "URI di reindirizzamento autorizzati" con lo stesso valore
6. Salva in entrambi i posti
7. Fai un nuovo deploy

---

## 🐛 Se il Problema Persiste

1. **Controlla i log di Vercel**:
   - Vai su Vercel Dashboard > Deployments
   - Clicca sul deployment più recente
   - Vai su "Functions" > `/api/auth`
   - Controlla i log per errori dettagliati

2. **Verifica che il progetto Google Cloud sia corretto**:
   - Assicurati di essere nel progetto giusto in Google Cloud Console
   - Verifica che le API (Drive, Gmail, Sheets) siano abilitate

3. **Rigenera le credenziali OAuth** (se necessario):
   - In Google Cloud Console, elimina le credenziali OAuth esistenti
   - Crea nuove credenziali OAuth
   - Aggiorna i valori in Vercel

---

**Buona verifica! 🔍**

