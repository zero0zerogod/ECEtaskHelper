const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        createProxyMiddleware({
            target: process.env.REACT_APP_SERVER_URL || 'http://localhost:8080',
            changeOrigin: true,
            pathFilter : '/api',
        })
    );
};