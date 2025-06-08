// File: /api/generate-text.js

export default async function handler(request, response) {
  // 只允許 POST 請求
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  // 從環境變數中讀取安全的 API 金鑰
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return response.status(500).json({ error: 'API key is not configured' });
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
    
    if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        console.error('Google API Error:', errorData);
        return response.status(apiResponse.status).json({ error: 'Failed to get response from Google API' });
    }

    const data = await apiResponse.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // 將 Google API 的結果回傳給前端
    // Vercel 會自動處理 CORS 跨域問題
    response.status(200).json({ text: text });

  } catch (error) {
    console.error('Internal Server Error:', error);
    response.status(500).json({ error: 'An internal error occurred' });
  }
}