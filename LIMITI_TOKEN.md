# 📊 Limiti Token OpenAI - Calcolo Minuti Video

## 🔑 Differenza Importante: Input vs Output

### `maxTokens = 4000` (OUTPUT)
- **Cosa limita**: La lunghezza della **dispensa generata** (output)
- **Non limita**: La lunghezza della trascrizione in input
- **Significato**: GPT-4o-mini genererà al massimo 4000 token di dispensa

### Limite INPUT (Trascrizione)
- **GPT-4o-mini**: Supporta fino a **128.000 token** di input
- **Questo è il limite reale** per la trascrizione del video

---

## 📐 Calcolo Minuti Video Supportati

### Parametri di Calcolo

1. **Velocità di parlato**: ~150-200 parole al minuto (media italiana/inglese)
2. **Token per parola**: ~1.3 token/parola (media)
3. **Token per minuto**: ~195-260 token/minuto
4. **Usiamo una media conservativa**: **250 token/minuto**

### Calcolo

```
Limite Input GPT-4o-mini: 128.000 token
Token per minuto video: ~250 token/minuto

Minuti supportati = 128.000 / 250 = ~512 minuti
```

### Risultato

✅ **Con GPT-4o-mini puoi trascrivere fino a ~500-512 minuti di video** (circa 8-8.5 ore)

---

## ⚠️ Considerazioni Aggiuntive

### Token del Prompt Template

Il prompt template aggiunge circa **500-800 token** al totale:
- Istruzioni per la formattazione
- Struttura richiesta
- Metadati

### Calcolo Reale

```
Token disponibili per trascrizione = 128.000 - 800 (prompt) = 127.200 token
Minuti supportati = 127.200 / 250 = ~509 minuti
```

**Risultato pratico**: **~500 minuti (8.3 ore) di video**

---

## 📝 Limite Output (maxTokens = 4000)

### Cosa significa?

Con `maxTokens = 4000`, la dispensa generata avrà:
- **~3000 parole** (circa 1.3 token/parola)
- **~6-8 pagine** di testo formattato
- **Dispensa completa e dettagliata** per la maggior parte dei video

### Quando aumentare maxTokens?

Aumenta `maxTokens` se:
- I video sono molto lunghi (>2 ore)
- Vuoi dispense più dettagliate
- La dispensa viene troncata

**Valori consigliati**:
- Video brevi (<30 min): `maxTokens = 2000-3000`
- Video medi (30-60 min): `maxTokens = 4000` ✅ (attuale)
- Video lunghi (1-2 ore): `maxTokens = 6000-8000`
- Video molto lunghi (>2 ore): `maxTokens = 10000-16000`

⚠️ **Nota**: Aumentare maxTokens aumenta i costi (output costa $0.60/1M token)

---

## 💰 Impatto sui Costi

### Costo per Video (esempio 30 minuti)

**Input (trascrizione)**:
- Token trascrizione: 30 min × 250 token/min = 7.500 token
- Token prompt: ~800 token
- **Totale input**: ~8.300 token
- **Costo input**: 8.300 / 1.000.000 × $0.15 = **$0.0012**

**Output (dispensa)**:
- Token output: ~4.000 token (maxTokens)
- **Costo output**: 4.000 / 1.000.000 × $0.60 = **$0.0024**

**Costo totale per video 30 min**: **~$0.0036**

### Costo per Video Lungo (esempio 2 ore = 120 minuti)

**Input**:
- Token trascrizione: 120 × 250 = 30.000 token
- Token prompt: ~800 token
- **Totale input**: ~30.800 token
- **Costo input**: 30.800 / 1.000.000 × $0.15 = **$0.0046**

**Output**:
- Token output: ~4.000 token
- **Costo output**: **$0.0024**

**Costo totale per video 2 ore**: **~$0.007**

---

## 🎯 Raccomandazioni

### Per Video Brevi (<30 min)
```env
OPENAI_MAX_TOKENS=3000
```
- Dispensa più concisa
- Costi leggermente inferiori

### Per Video Medi (30-90 min) ✅ ATTUALE
```env
OPENAI_MAX_TOKENS=4000
```
- Bilanciamento perfetto
- Dispensa completa e dettagliata

### Per Video Lunghi (1-3 ore)
```env
OPENAI_MAX_TOKENS=6000
```
- Dispensa più dettagliata
- Copre meglio contenuti complessi

### Per Video Molto Lunghi (3-8 ore)
```env
OPENAI_MAX_TOKENS=10000
```
- Dispensa molto dettagliata
- Costi output più alti ma ancora gestibili

---

## 📊 Tabella Riepilogativa

| Durata Video | Token Input | Costo Input | maxTokens | Costo Output | Costo Totale |
|--------------|-------------|-------------|-----------|--------------|--------------|
| 10 min       | ~2.500      | $0.0004     | 3000      | $0.0018      | **$0.0022**  |
| 30 min       | ~7.500      | $0.0012     | 4000      | $0.0024      | **$0.0036**  |
| 60 min       | ~15.000     | $0.0023     | 4000      | $0.0024      | **$0.0047**  |
| 120 min      | ~30.000     | $0.0046     | 6000      | $0.0036      | **$0.0082**  |
| 240 min      | ~60.000     | $0.0090     | 8000      | $0.0048      | **$0.0138**  |
| 480 min      | ~120.000    | $0.0180     | 10000     | $0.0060      | **$0.0240**  |

---

## 🔧 Come Modificare maxTokens

### In Vercel (Produzione)

1. Vai su Vercel Dashboard
2. Settings > Environment Variables
3. Trova `OPENAI_MAX_TOKENS`
4. Modifica il valore (es. da 4000 a 6000)
5. Salva e fai un nuovo deploy

### In Sviluppo Locale

Modifica `.env.local`:
```env
OPENAI_MAX_TOKENS=6000
```

---

## ✅ Conclusione

**Risposta diretta**: Con `maxTokens = 4000` puoi trascrivere fino a **~500 minuti (8.3 ore)** di video, perché il limite è dato dal context window di input (128K token), non da maxTokens.

**maxTokens = 4000** limita solo la lunghezza della dispensa generata, non la trascrizione in input.

Per la maggior parte dei video YouTube (tipicamente 10-60 minuti), `maxTokens = 4000` è perfetto! 🎯

