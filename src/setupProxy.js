const { createProxyMiddleware } = require('http-proxy-middleware');

const dotenv = require('dotenv');

dotenv.config()

const proxy = {
    target: process.env.REACT_APP_SERVER_URL,
    changeOrigin: true
}

module.exports = function (app) {
    console.log("chamando back");
    app.use('/auth/**',
    createProxyMiddleware(proxy)
    );
};
