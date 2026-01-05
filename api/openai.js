/**
 * API Route per OpenAI - Elaborazione trascrizioni con GPT-4o-mini
 * Le API keys sono gestite tramite variabili d'ambiente per sicurezza
 * Supporta video fino a 4 ore (240 minuti)
 */

export default async function handler(req, res) {
  // Solo metodo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { transcript, videoTitle, videoUrl, author, prompt } = req.body;

    // Validazione input
    if (!transcript || !prompt) {
      return res.status(400).json({ error: 'Transcript e prompt sono richiesti' });
    }

    // Validazione lunghezza trascrizione (limite 4 ore = ~60.000 token)
    // Stima: ~250 token per minuto, 4 ore = 240 minuti = ~60.000 token
    // GPT-4o-mini supporta 128K token, ma limitiamo a 4 ore per sicurezza
    const estimatedTokens = Math.ceil(transcript.length / 4); // Stima approssimativa: ~4 caratteri per token
    const maxTokensFor4Hours = 60000; // ~240 minuti × 250 token/min
    
    if (estimatedTokens > maxTokensFor4Hours) {
      return res.status(400).json({ 
        error: 'Video troppo lungo. Il limite massimo è di 4 ore (240 minuti).',
        estimatedTokens,
        maxTokens: maxTokensFor4Hours
      });
    }

    // Verifica API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OpenAI API key non configurata' });
    }

    // Chiamata a OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Sei un assistente esperto nella creazione di dispense didattiche professionali da trascrizioni video.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        // Per video lunghi (fino a 4 ore), usiamo 8000 token per output
        // Questo permette dispense dettagliate anche per contenuti molto lunghi
        max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS || '8000'),
        temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7')
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', errorData);
      return res.status(response.status).json({ 
        error: `OpenAI API error: ${errorData.error?.message || response.statusText}` 
      });
    }

    const data = await response.json();
    const dispensa = data.choices[0].message.content;

    return res.status(200).json({ 
      success: true,
      dispensa 
    });

  } catch (error) {
    console.error('Errore elaborazione OpenAI:', error);
    return res.status(500).json({ 
      error: 'Errore interno del server',
      message: error.message 
    });
  }
}

