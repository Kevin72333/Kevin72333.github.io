// /api/generate-text.js  (偵錯專用版本)

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

  // --- 決定性的測試點 ---
  // ⚠️ 警告：僅供偵錯！請直接將您的 Gemini API Key 貼在引號中間。
  // 測試完後必須立刻刪除此行，並換回 process.env.GEMINI_API_KEY
  const apiKey = "AIzaSyAIDPpJtkB7yKElnBvJ4oPLGofS3uJ-Lkc"; 

  // 如果上面那行 apiKey 是空的或是 "請在這裡..."，就直接報錯
  if (!apiKey || apiKey.startsWith("請在這裡")) {
    return response.status(500).json({ error: 'API Key not hardcoded for debugging.' });
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