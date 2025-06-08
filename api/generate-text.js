// /api/generate-text.js (安全的正式版本)

const allowedOrigin = 'https://kevin72333-github-io.vercel.app';

export default async function handler(request, response) {
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return response.status(200).end();
  }

  response.setHeader('Access-Control-Allow-Origin', allowedOrigin);

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  // 恢復成從環境變數讀取，這是安全作法
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return response.status(500).json({ error: 'API key is not configured on the server.' });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const googleApiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request.body),
    });

    const result = await googleApiResponse.json();
    return response.status(googleApiResponse.status).json(result);

  } catch (error) {
    console.error('Error proxying to Google AI API:', error);
    return response.status(500).json({ error: 'An internal server error occurred.' });
  }
}