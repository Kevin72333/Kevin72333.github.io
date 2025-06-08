// File: /api/generate-text.js

export default async function handler(request, response) {
  // 只允許 POST 請求
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  // 從環境變數中讀取安全的 API 金鑰
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return response.status(500).json({ error: 'API key is not configured on Vercel' });
  }

  try {
    const userPrompt = request.body.prompt;
    const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const apiResponse = await fetch(googleApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }]
      }),
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
        console.error('Google API Error:', data);
        return response.status(apiResponse.status).json({ error: data.error.message || 'Failed to get response from Google API' });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    response.status(200).json({ text: text });

  } catch (error) {
    console.error('Internal Server Error:', error);
    response.status(500).json({ error: 'An internal error occurred' });
  }
}