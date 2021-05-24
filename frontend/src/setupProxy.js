const { createProxyMiddleware } = require('http-proxy-middleware');
console.log(process.env.REACT_APP_BACKEND_URL);
module.exports = function(app) {
  app.use(createProxyMiddleware("/api",{
     target: process.env.REACT_APP_BACKEND_URL,
     secure: false,
     changeOrigin: true,
     ws: true
  }));
};