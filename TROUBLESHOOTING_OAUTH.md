# 🔧 Troubleshooting: Errore "invalid_client" OAuth

## ❌ Errore: `invalid_client`

Questo errore indica che Google non riconosce le credenziali OAuth. Ecco come risolverlo:

---

## 🔍 Cause Comuni

### 1. Variabili d'Ambiente Non Configurate in Vercel

**Problema**: Le variabili `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` o `GOOGLE_REDIRECT_URI` non sono configurate o sono errate.

**Soluzione**:
1. Vai su Vercel Dashboard > Il tuo progetto > **Settings** > **Environment Variables**
2. Verifica che queste variabili siano presenti:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REDIRECT_URI`
3. Controlla che i valori siano corretti (senza spazi, senza virgolette extra)
4. **Fai un nuovo deploy** dopo aver modificato le variabili

---

### 2. GOOGLE_REDIRECT_URI Non Corrisponde

**Problema**: Il `GOOGLE_REDIRECT_URI` in Vercel non corrisponde esattamente a quello configurato in Google Cloud Console.

**Soluzione**:

#### In Vercel:
1. Vai su **Settings** > **Environment Variables**
2. Trova `GOOGLE_REDIRECT_URI`
3. Deve essere esattamente:
   ```
   https://tuodominio.vercel.app/api/auth?action=callback
   ```
   (Sostituisci `tuodominio` con il tuo dominio Vercel reale)

#### In Google Cloud Console:
1. Vai su https://console.cloud.google.com/
2. **"API e servizi"** > **"Credenziali"**
3. Clicca sul tuo **"ID client OAuth"**
4. In **"URI di reindirizzamento autorizzati"**, deve esserci esattamente:
   ```
   https://tuodominio.vercel.app/api/auth?action=callback
   ```
5. **IMPORTANTE**: 
   - Deve essere identico (stesso dominio, stesso path)
   - Non ci devono essere spazi
   - Deve iniziare con `https://` (non `http://`)
   - Deve finire con `/api/auth?action=callback`

6. Clicca **"Salva"**

---

### 3. Client ID o Client Secret Errati

**Problema**: I valori di `GOOGLE_CLIENT_ID` o `GOOGLE_CLIENT_SECRET` sono sbagliati.

**Soluzione**:
1. Vai su Google Cloud Console > **"API e servizi"** > **"Credenziali"**
2. Clicca sul tuo **"ID client OAuth"**
3. **COPIA** di nuovo:
   - **ID client** (Client ID): `xxxxxx-xxxxx.apps.googleusercontent.com`
   - **Segreto client** (Client Secret): `GOCSPX-xxxxx`
4. Vai su Vercel > **Settings** > **Environment Variables**
5. Aggiorna i valori:
   - `GOOGLE_CLIENT_ID` = il Client ID copiato
   - `GOOGLE_CLIENT_SECRET` = il Client Secret copiato
6. **Fai un nuovo deploy**

---

### 4. Dominio Vercel Cambiato

**Problema**: Se hai cambiato il dominio Vercel, devi aggiornare sia Vercel che Google Cloud Console.

**Soluzione**:
1. Ottieni il nuovo dominio Vercel (es. `studia-video-youtube-abc123.vercel.app`)
2. Aggiorna `GOOGLE_REDIRECT_URI` in Vercel con il nuovo dominio
3. Aggiorna gli URI autorizzati in Google Cloud Console con il nuovo dominio
4. **Fai un nuovo deploy**

---

## ✅ Checklist di Verifica

Usa questa checklist per verificare che tutto sia configurato correttamente:

### In Vercel:
- [ ] `GOOGLE_CLIENT_ID` è presente e corretto
- [ ] `GOOGLE_CLIENT_SECRET` è presente e corretto
- [ ] `GOOGLE_REDIRECT_URI` è presente e corrisponde al dominio Vercel
- [ ] Le variabili sono applicate a Production, Preview e Development
- [ ] Hai fatto un nuovo deploy dopo aver modificato le variabili

### In Google Cloud Console:
- [ ] Il Client ID corrisponde a quello in Vercel
- [ ] Il Client Secret corrisponde a quello in Vercel
- [ ] L'URI di reindirizzamento in Google Cloud Console è identico a `GOOGLE_REDIRECT_URI` in Vercel
- [ ] L'URI inizia con `https://` (non `http://`)
- [ ] L'URI finisce con `/api/auth?action=callback`
- [ ] Non ci sono spazi o caratteri extra

---

## 🔧 Passi per Risolvere

### Passo 1: Verifica le Variabili in Vercel

1. Vai su Vercel Dashboard
2. Seleziona il progetto
3. Vai su **Settings** > **Environment Variables**
4. Verifica che tutte e tre le variabili siano presenti:
   ```
   GOOGLE_CLIENT_ID = xxxxxx-xxxxx.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET = GOCSPX-xxxxx
   GOOGLE_REDIRECT_URI = https://tuodominio.vercel.app/api/auth?action=callback
   ```

### Passo 2: Verifica in Google Cloud Console

1. Vai su https://console.cloud.google.com/
2. Seleziona il progetto corretto
3. Vai su **"API e servizi"** > **"Credenziali"**
4. Clicca sul tuo **"ID client OAuth"**
5. Verifica:
   - **ID client** corrisponde a `GOOGLE_CLIENT_ID` in Vercel
   - **Segreto client** corrisponde a `GOOGLE_CLIENT_SECRET` in Vercel
   - **URI di reindirizzamento autorizzati** contiene esattamente:
     ```
     https://tuodominio.vercel.app/api/auth?action=callback
     ```

### Passo 3: Aggiorna se Necessario

Se qualcosa non corrisponde:
1. Aggiorna i valori in Vercel
2. Aggiorna gli URI in Google Cloud Console
3. **Salva** in entrambi i posti
4. **Fai un nuovo deploy** su Vercel

### Passo 4: Test

1. Vai sull'app Vercel
2. Clicca "Accedi con Google"
3. Dovresti essere reindirizzato a Google senza errori

---

## 🐛 Debug Avanzato

Se il problema persiste, controlla i log di Vercel:

1. Vai su Vercel Dashboard > **Deployments**
2. Clicca sul deployment più recente
3. Vai su **"Functions"**
4. Clicca su `/api/auth`
5. Controlla i log per vedere errori dettagliati

---

## 📞 Supporto

Se dopo aver seguito tutti questi passi il problema persiste:

1. Verifica i log di Vercel per errori dettagliati
2. Controlla la console del browser (F12) per errori JavaScript
3. Assicurati che il progetto Google Cloud sia lo stesso usato per creare le credenziali OAuth

---

**Buona risoluzione! 🔧**

