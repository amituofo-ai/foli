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
    // 1. Define Model (gemini-1.5-flash)
    const model = 'gemini-1.5-flash';
    
    // 2. Use URL object for safe parameter handling
    const baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    const urlObj = new URL(baseUrl);
    
    // 3. Append API Key safely using URLSearchParams
    urlObj.searchParams.append('key', apiKey);
    
    // 4. Strict Content-Type setting
    const response = await fetch(urlObj.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      }
    );

    if (!response.ok) {
        const errorText = await response.text();
        
        // 5. Log Masked URL for debugging
        const maskedUrl = urlObj.toString().replace(apiKey, '***HIDDEN_KEY***');
        console.error(`[Gemini API Error] Status: ${response.status}`);
        console.error(`[Gemini API Error] URL: ${maskedUrl}`);
        console.error(`[Gemini API Error] Body: ${errorText}`);

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
