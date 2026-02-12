export default async function handler(req, res) {
  // 1. CORS Headers (Optional but good for debugging)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set');
    return res.status(500).json({ error: 'API Key Config Error' });
  }

  try {
    // 2. Simple URL Construction (gemini-2.5-flash)
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    console.log('Proxying to Gemini 2.5...');

    // Ensure strict body structure (only contents)
    if (!req.body || !req.body.contents) {
      console.error('Invalid Request Body:', req.body);
      return res.status(400).json({ error: 'Invalid Request Body', details: 'Missing contents array' });
    }

    const geminiBody = {
      contents: req.body.contents
    };
    
    console.log('Sending body to Gemini:', JSON.stringify(geminiBody).substring(0, 200) + '...');

    // 3. Fetch
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(geminiBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API Error (${response.status}):`, errorText);
      return res.status(response.status).json({ 
        error: 'Gemini API Error', 
        details: errorText 
      });
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
