# ⏱️ Configurazione per Video fino a 4 Ore

## ✅ Modifiche Applicate

L'app è stata configurata per supportare video fino a **4 ore (240 minuti)**.

### Modifiche Implementate

1. **maxTokens aumentato a 8000** (da 4000)
   - Permette dispense più dettagliate per video lunghi
   - Configurabile tramite variabile d'ambiente `OPENAI_MAX_TOKENS`

2. **Validazione lunghezza video**
   - Limite impostato a 4 ore (60.000 token stimati)
   - Validazione sia nel frontend che nel backend
   - Messaggi di errore chiari se il video supera il limite

3. **Calcolo token**
   - Stima: ~250 token per minuto di video
   - 4 ore = 240 minuti = ~60.000 token
   - Ben dentro il limite di GPT-4o-mini (128K token)

## 🔧 Configurazione Variabili d'Ambiente

### Per Vercel (Produzione)

Nel pannello Vercel > Settings > Environment Variables, imposta:

```env
OPENAI_MAX_TOKENS=8000
```

### Per Sviluppo Locale

Nel file `.env.local`:

```env
OPENAI_MAX_TOKENS=8000
```

## 📊 Capacità Supportate

| Durata Video | Token Input | maxTokens | Risultato |
|--------------|-------------|-----------|-----------|
| 1 ora        | ~15.000     | 8000      | ✅ Ottimale |
| 2 ore        | ~30.000     | 8000      | ✅ Ottimale |
| 3 ore        | ~45.000     | 8000      | ✅ Ottimale |
| 4 ore        | ~60.000     | 8000      | ✅ Massimo supportato |
| >4 ore       | >60.000     | -         | ❌ Non supportato |

## 💰 Costi Stimati per Video 4 Ore

**Input (trascrizione)**:
- Token: ~60.000 token
- Costo: 60.000 / 1.000.000 × $0.15 = **$0.009**

**Output (dispensa)**:
- Token: ~8.000 token (maxTokens)
- Costo: 8.000 / 1.000.000 × $0.60 = **$0.0048**

**Costo totale per video 4 ore**: **~$0.014** (circa 1.4 centesimi)

## ⚠️ Note Importanti

1. **Tempi di elaborazione**: Video più lunghi richiedono più tempo
   - 1 ora: ~2-3 minuti
   - 4 ore: ~8-12 minuti

2. **Qualità dispensa**: Con 8000 token di output, la dispensa sarà molto dettagliata anche per video lunghi

3. **Limite tecnico**: GPT-4o-mini supporta fino a 128K token, ma abbiamo impostato 4 ore come limite pratico per:
   - Tempi di elaborazione ragionevoli
   - Costi controllati
   - Qualità ottimale della dispensa

## 🔄 Come Modificare il Limite

Se vuoi aumentare oltre 4 ore:

1. Modifica `api/openai.js`:
   ```javascript
   const maxTokensFor4Hours = 90000; // Per 6 ore
   ```

2. Modifica `studia-video-youtube.html`:
   ```javascript
   const maxTokensFor4Hours = 90000; // Per 6 ore
   ```

3. Aggiorna il messaggio nell'interfaccia

⚠️ **Nota**: Video più lunghi aumentano tempi e costi.

## ✅ Test

Per testare con un video di 4 ore:

1. Trova un video YouTube di ~4 ore
2. Inserisci l'URL nell'app
3. Verifica che venga processato correttamente
4. Controlla che la dispensa sia dettagliata

Se provi con un video >4 ore, dovresti vedere un messaggio di errore chiaro.

