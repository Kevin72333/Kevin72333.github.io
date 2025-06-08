export default async function handler(request, response) {
  // 只接受 POST 請求
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  // 從環境變數中安全地讀取 API 金鑰
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return response.status(500).json({ error: 'API key not configured' });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  try {
    // 將前端傳來的請求主體 (request.body) 直接轉發給 Google API
    const googleApiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request.body), // 直接使用前端傳來的 body
    });

    if (!googleApiResponse.ok) {
      const errorBody = await googleApiResponse.text();
      // 將 Google API 的錯誤回傳給前端
      return response.status(googleApiResponse.status).send(errorBody);
    }

    const data = await googleApiResponse.json();
    // 將成功的結果回傳給前端
    return response.status(200).json(data);

  } catch (error) {
    console.error('Error proxying to Gemini API:', error);
    return response.status(500).json({ error: 'An internal error occurred' });
  }
}// JavaScript Document