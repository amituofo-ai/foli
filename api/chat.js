export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set');
    return res.status(500).json({ 
        error: 'Server configuration error', 
        details: 'API Key not configured. Please set GEMINI_API_KEY in Vercel Project Settings.' 
    });
  }

  try {
    const model = 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      }
    );

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API Error:', response.status, errorText);
        // Try to parse error text as JSON for better details
        let errorDetails = errorText;
        try {
            const jsonError = JSON.parse(errorText);
            if (jsonError.error && jsonError.error.message) {
                errorDetails = jsonError.error.message;
            }
        } catch (e) {}
        
        return res.status(response.status).json({ 
            error: 'Upstream API Error', 
            details: errorDetails,
            model: model 
        });
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
