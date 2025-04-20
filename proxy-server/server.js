const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors()); // allow all CORS by default

// Example: /proxy/api/config/countries?target=192.168.0.2:8000
app.use('/proxy', (req, res, next) => {
  const target = req.query.target;
  if (!target) return res.status(400).send('Missing target parameter');

  return createProxyMiddleware({
    target: `http://${target}`,
    changeOrigin: true,
    pathRewrite: (path, req) => path.replace(/^\/proxy/, ''),
  })(req, res, next);
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`✅ Proxy server running at http://localhost:${PORT}`);
});
