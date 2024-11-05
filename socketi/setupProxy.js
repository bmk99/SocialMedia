const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        '/api1',
        createProxyMiddleware({
            target: 'https://connect2all.onrender.com',
            changeOrigin: true,
            // ws:false
        })
    );
    // app.use(
    //     'api2',
    //     createProxyMiddleware({
    //         target: "http://localhost:8001",
    //         changeOrigin:true,
    //         ws:false,
    //     })
    // )
};