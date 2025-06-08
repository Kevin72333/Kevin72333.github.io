// /api/generate-text.js

// 允許來自您 GitHub Pages 網域的請求
const allowedOrigin = 'https://kevin72333-github-io.vercel.app';

export default async function handler(request, response) {
  // --- CORS 預檢請求處理 (Preflight) ---
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return response.status(200).end();
  }

  // --- 主要請求處理 ---
  // 設定 CORS 標頭
  response.setHeader('Access-Control-Allow-Origin', allowedOrigin);

  // 只允許 POST 方法
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return response.status(500).json({ error: 'API key is not configured on the server.' });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    // 將前端傳來的 request body 直接轉發給 Google API
    const googleApiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request.body), // request.body 包含了 { contents: [...] }
    });

    const result = await googleApiResponse.json();

    // 無論 Google API 回傳成功或失敗，都將其結果回傳給前端
    // 這樣前端才能知道詳細的錯誤原因 (例如內容被封鎖)
    return response.status(googleApiResponse.status).json(result);

  } catch (error) {
    console.error('Error proxying to Google AI API:', error);
    return response.status(500).json({ error: 'An internal server error occurred.' });
  }
}
}