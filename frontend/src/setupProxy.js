const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(createProxyMiddleware(`/${process.env.REACT_APP_RESTAPI_PATH}`,{
     target: `http://localhost:5000`,
     secure: false,
     changeOrigin: true,
     ws: true
  }));
};