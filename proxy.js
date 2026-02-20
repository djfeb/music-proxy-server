const express = require('express');
const http = require('http');

const app = express();

// Proxy middleware
app.use((req, res) => {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: req.originalUrl,
    method: req.method,
    headers: req.headers
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  req.pipe(proxyReq, { end: true });

  proxyReq.on('error', (err) => {
    console.error('Proxy error:', err.message);
    res.status(500).send('Proxy Server Error');
  });
});

app.listen(5000, () => {
  console.log('Proxy server running at http://localhost:5000');
});