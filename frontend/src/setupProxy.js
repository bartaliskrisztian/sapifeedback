const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(createProxyMiddleware(`/${process.env.REACT_APP_RESTAPI_PATH}`,{
     target: `${process.env.REACT_APP_SERVER_URL}`,
     secure: false,
     changeOrigin: true,
     ws: true
  }));
};