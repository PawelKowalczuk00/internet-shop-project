const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/*',
    proxy({
      target: 'https://internet-shop-project-pk2020.herokuapp.com',
      changeOrigin: true,
    })
  );
};