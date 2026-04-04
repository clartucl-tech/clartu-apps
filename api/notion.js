export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Notion-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { path } = req.query;
    if (!path) {
      res.status(400).json({ error: 'Missing path parameter' });
      return;
    }

    const token = req.headers['authorization'];
    if (!token) {
      res.status(401).json({ error: 'Missing Authorization header' });
      return;
    }

    const notionUrl = `https://api.notion.com/v1/${path}`;
    const response = await fetch(notionUrl, {
      method: req.method === 'GET' ? 'GET' : 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
