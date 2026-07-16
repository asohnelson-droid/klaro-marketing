const https = require('https');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const body = JSON.stringify(req.body);
  const options = {
    hostname: 'klaro-app-aul843gnc-nelson-asohs-projects.vercel.app',
    path: '/api/founding-circle',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    }
  };

  return new Promise((resolve) => {
    const proxyReq = https.request(options, (proxyRes) => {
      let data = '';
      proxyRes.on('data', chunk => data += chunk);
      proxyRes.on('end', () => {
        try {
          res.status(proxyRes.statusCode).json(JSON.parse(data));
        } catch {
          res.status(500).json({ success: false, error: 'Invalid response from server.' });
        }
        resolve();
      });
    });

    proxyReq.on('error', () => {
      res.status(500).json({ success: false, error: 'Could not connect to server.' });
      resolve();
    });

    proxyReq.write(body);
    proxyReq.end();
  });
};