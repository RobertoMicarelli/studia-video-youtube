# Design System - Elementi Grafici e Stili

Questo documento contiene tutti gli elementi di design, stili CSS, animazioni e componenti grafici utilizzati nel progetto, pronti per essere riutilizzati in altri progetti.

---

## 📦 Dipendenze e Font

### CDN e Librerie
```html
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
```

### Font
- **Sans-serif (Body)**: `Inter` (pesi: 300, 400, 500, 600, 700)
- **Display (Titoli)**: `Outfit` (pesi: 600, 700, 800)

---

## 🎨 Configurazione Tailwind

```javascript
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                'sans': ['Inter', 'system-ui', 'sans-serif'],
                'display': ['Outfit', 'system-ui', 'sans-serif'],
            },
            colors: {
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                },
                accent: {
                    500: '#8b5cf6',
                    600: '#7c3aed',
                }
            }
        }
    }
}
```

---

## 🎨 Palette Colori

### Gradienti Principali
- **Gradiente Background**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Gradiente Bottone**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Gradiente Testo**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Gradiente Successo**: `linear-gradient(135deg, #10b981 0%, #059669 100%)`
- **Gradiente Login Screen**: `linear-gradient(to bottom right, from-purple-900 via-purple-800 to-indigo-900)`

### Colori Solidi
- **Primary 500**: `#0ea5e9` (Sky Blue)
- **Primary 600**: `#0284c7` (Sky Blue Dark)
- **Primary 700**: `#0369a1` (Sky Blue Darker)
- **Accent 500**: `#8b5cf6` (Violet)
- **Accent 600**: `#7c3aed` (Violet Dark)
- **Success**: `#10b981` (Green)
- **Success Dark**: `#059669` (Green Dark)

---

## 🧩 Componenti CSS Custom

### 1. Glass Card (Effetto Vetro)
```css
.glass-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
```

**Utilizzo HTML:**
```html
<div class="glass-card rounded-3xl p-6 md:p-10">
    <!-- Contenuto -->
</div>
```

---

### 2. Bottone Primario
```css
.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transition: all 0.3s ease;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(102, 126, 234, 0.6);
}

.btn-primary:active {
    transform: translateY(0);
}
```

**Utilizzo HTML:**
```html
<button class="btn-primary text-white px-6 py-3 rounded-xl font-semibold">
    Clicca qui
</button>
```

---

### 3. Testo con Gradiente
```css
.gradient-text {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
```

**Utilizzo HTML:**
```html
<h1 class="gradient-text text-4xl font-bold">Titolo con Gradiente</h1>
```

---

### 4. Card Risultato (Success)
```css
.result-card {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
    border-left: 4px solid #10b981;
}
```

**Utilizzo HTML:**
```html
<div class="result-card p-6 rounded-xl">
    <!-- Contenuto successo -->
</div>
```

---

### 5. Step Item (Indicatore Progresso)
```css
.step-item {
    transition: all 0.3s ease;
}

.step-item.active {
    transform: scale(1.05);
}

.step-icon {
    transition: all 0.3s ease;
}

.step-icon.completed {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
}

.step-icon.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

**Utilizzo HTML:**
```html
<div class="step-item text-center">
    <div class="step-icon w-12 h-12 rounded-full bg-gray-200 mx-auto mb-2 flex items-center justify-center text-xl">
        1
    </div>
    <p class="text-xs font-medium text-gray-600">Step 1</p>
</div>
```

---

### 6. Progress Bar
```css
.progress-bar {
    transition: width 0.5s ease;
}
```

**Utilizzo HTML:**
```html
<div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
    <div class="progress-bar bg-gradient-to-r from-blue-500 to-purple-600 h-full" style="width: 50%"></div>
</div>
```

---

### 7. Input Focus
```css
input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}
```

**Utilizzo HTML:**
```html
<input 
    type="text" 
    class="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-primary-500 transition-all"
/>
```

---

## 🎬 Animazioni

### 1. Slide In
```css
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.slide-in {
    animation: slideIn 0.5s ease-out;
}
```

**Utilizzo HTML:**
```html
<div class="slide-in">
    <!-- Contenuto che appare con animazione -->
</div>
```

**Con delay:**
```html
<div class="slide-in" style="animation-delay: 0.1s;">
    <!-- Contenuto con delay -->
</div>
```

---

### 2. Float Animation
```css
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}

.float-animation {
    animation: float 3s ease-in-out infinite;
}
```

**Utilizzo HTML:**
```html
<div class="float-animation text-6xl">📚</div>
```

---

### 3. Pulse Slow
```css
@keyframes pulse-slow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.animate-pulse-slow {
    animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

**Utilizzo HTML:**
```html
<div class="animate-pulse-slow">Caricamento...</div>
```

---

## 🎯 Componenti UI Completi

### 1. Login Screen
```html
<div class="fixed inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center z-50">
    <div class="bg-white rounded-3xl p-8 md:p-12 max-w-md w-full mx-4 shadow-2xl">
        <div class="text-center mb-8">
            <div class="text-6xl mb-4">🔐</div>
            <h2 class="text-3xl font-bold text-gray-800 mb-2">Accesso Protetto</h2>
            <p class="text-gray-600">Inserisci le credenziali per accedere</p>
        </div>
        
        <form class="space-y-6">
            <div>
                <label for="username" class="block text-sm font-semibold text-gray-700 mb-2">
                    👤 Username
                </label>
                <input 
                    type="text" 
                    id="username" 
                    required
                    placeholder="Inserisci username"
                    class="w-full px-5 py-4 border-2 border-gray-300 rounded-xl text-base bg-white text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all shadow-sm"
                />
            </div>
            
            <div>
                <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
                    🔑 Password
                </label>
                <input 
                    type="password" 
                    id="password" 
                    required
                    placeholder="Inserisci password"
                    class="w-full px-5 py-4 border-2 border-gray-300 rounded-xl text-base bg-white text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all shadow-sm"
                />
            </div>
            
            <button 
                type="submit"
                class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-4 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all"
            >
                🚀 Accedi
            </button>
        </form>
    </div>
</div>
```

---

### 2. Card Principale con Glass Effect
```html
<div class="glass-card rounded-3xl p-6 md:p-10 mb-6 slide-in">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Titolo Card</h2>
    <p class="text-gray-600">Contenuto della card...</p>
</div>
```

---

### 3. Progress Steps
```html
<div class="flex justify-between items-center mb-8">
    <div class="step-item text-center">
        <div class="step-icon w-12 h-12 rounded-full bg-gray-200 mx-auto mb-2 flex items-center justify-center text-xl">
            📥
        </div>
        <p class="text-xs font-medium text-gray-600">Estrazione</p>
    </div>
    <div class="step-item text-center">
        <div class="step-icon w-12 h-12 rounded-full bg-gray-200 mx-auto mb-2 flex items-center justify-center text-xl">
            🤖
        </div>
        <p class="text-xs font-medium text-gray-600">Elaborazione AI</p>
    </div>
    <div class="step-item text-center">
        <div class="step-icon w-12 h-12 rounded-full bg-gray-200 mx-auto mb-2 flex items-center justify-center text-xl">
            💾
        </div>
        <p class="text-xs font-medium text-gray-600">Salvataggio</p>
    </div>
    <div class="step-item text-center">
        <div class="step-icon w-12 h-12 rounded-full bg-gray-200 mx-auto mb-2 flex items-center justify-center text-xl">
            📧
        </div>
        <p class="text-xs font-medium text-gray-600">Notifica</p>
    </div>
</div>
```

---

### 4. Progress Bar Completa
```html
<div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-4">
    <div id="progressBar" class="progress-bar bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-500" style="width: 0%"></div>
</div>
<div class="text-center">
    <span id="progressPercent" class="text-sm font-semibold text-gray-700">0%</span>
</div>
```

---

### 5. Info Cards (Grid)
```html
<div class="grid md:grid-cols-3 gap-4">
    <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
        <div class="text-3xl mb-3">🎯</div>
        <h3 class="font-bold text-gray-800 mb-2">Titolo Card</h3>
        <p class="text-sm text-gray-600">
            Descrizione della card...
        </p>
    </div>
    <!-- Altre card -->
</div>
```

---

### 6. Input Field Stylizzato
```html
<div class="mb-6">
    <label for="inputId" class="block text-sm font-semibold text-gray-700 mb-3">
        🎬 Etichetta Input
    </label>
    <input 
        type="text" 
        id="inputId" 
        placeholder="Placeholder..."
        class="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-base focus:border-primary-500 transition-all"
    />
    <p class="text-sm text-gray-500 mt-2">
        💡 Testo di aiuto
    </p>
</div>
```

---

### 7. Bottone con Gradiente
```html
<button class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-4 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all">
    🚀 Testo Bottone
</button>
```

---

### 8. Select Dropdown
```html
<select 
    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 font-medium"
>
    <option value="option1">Opzione 1</option>
    <option value="option2">Opzione 2</option>
</select>
```

---

### 9. Messaggio di Errore
```html
<div class="hidden p-3 bg-red-50 border-2 border-red-300 rounded-lg text-red-700 text-sm text-center font-medium">
    Messaggio di errore
</div>
```

---

### 10. Messaggio di Successo
```html
<div class="p-4 bg-green-50 border border-green-200 rounded-xl">
    <p class="text-sm text-green-800 text-center font-medium">
        ✅ Operazione completata con successo!
    </p>
</div>
```

---

## 🎨 Background e Layout

### Background Body
```css
body {
    font-family: 'Inter', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}
```

### Container Principale
```html
<div class="max-w-5xl mx-auto">
    <!-- Contenuto -->
</div>
```

---

## 📱 Responsive Design

### Breakpoints Tailwind
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Esempi Utilizzo
```html
<!-- Padding responsive -->
<div class="p-4 md:p-8">

<!-- Text size responsive -->
<h1 class="text-4xl md:text-5xl lg:text-6xl">

<!-- Grid responsive -->
<div class="grid md:grid-cols-3 gap-4">

<!-- Display responsive -->
<div class="hidden md:block">
```

---

## 🎯 Utility Classes Tailwind Utilizzate

### Spacing
- `p-4`, `p-6`, `p-8`, `p-10`, `p-12` (padding)
- `mb-2`, `mb-4`, `mb-6`, `mb-8` (margin bottom)
- `gap-2`, `gap-4`, `gap-6` (gap)

### Border Radius
- `rounded-xl` (12px)
- `rounded-2xl` (16px)
- `rounded-3xl` (24px)
- `rounded-full` (9999px)

### Shadows
- `shadow-sm` (small)
- `shadow-lg` (large)
- `shadow-xl` (extra large)
- `shadow-2xl` (2x extra large)

### Opacity
- `bg-white/90` (90% opacity)
- `bg-white/10` (10% opacity)
- `text-white/80` (80% opacity)

### Backdrop Blur
- `backdrop-blur-sm` (4px blur)

---

## 🚀 Esempio Completo di Pagina

```html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mia App</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .glass-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            transition: all 0.3s ease;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px -5px rgba(102, 126, 234, 0.6);
        }

        .slide-in {
            animation: slideIn 0.5s ease-out;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
</head>
<body class="p-4 md:p-8">
    <div class="max-w-5xl mx-auto">
        <div class="glass-card rounded-3xl p-6 md:p-10 mb-6 slide-in">
            <h1 class="text-4xl font-bold text-gray-800 mb-4">Titolo</h1>
            <p class="text-gray-600 mb-6">Contenuto...</p>
            <button class="btn-primary text-white px-6 py-3 rounded-xl font-semibold">
                Clicca qui
            </button>
        </div>
    </div>
</body>
</html>
```

---

## 📝 Note per l'Implementazione

1. **Tailwind CDN**: Il progetto usa Tailwind via CDN. Per progetti di produzione, considera l'installazione via npm per ottimizzare il bundle.

2. **Font**: Assicurati di includere i link ai font Google Fonts prima degli stili custom.

3. **Backdrop Filter**: L'effetto glass card richiede `backdrop-filter` che potrebbe non funzionare su browser molto vecchi.

4. **Animazioni**: Le animazioni CSS sono ottimizzate per performance. Usa `transform` e `opacity` invece di proprietà che causano reflow.

5. **Responsive**: Tutti i componenti sono progettati per essere responsive. Testa su diversi dispositivi.

---

## 🎨 Personalizzazione

### Cambiare Colori
Modifica i gradienti nel CSS:
```css
/* Esempio: Gradiente blu-verde */
background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%);
```

### Cambiare Font
Modifica la configurazione Tailwind:
```javascript
fontFamily: {
    'sans': ['Roboto', 'sans-serif'],
    'display': ['Montserrat', 'sans-serif'],
}
```

### Aggiungere Nuove Animazioni
```css
@keyframes miaAnimazione {
    0% { /* stato iniziale */ }
    100% { /* stato finale */ }
}

.mia-classe {
    animation: miaAnimazione 1s ease-in-out;
}
```

---

**Creato per**: Studia i tuoi Video Preferiti  
**Data**: 2024  
**Versione**: 1.0
