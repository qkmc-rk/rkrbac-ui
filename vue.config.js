module.exports = {
    publicPath: './',
    devServer: {
        open: true,
        host: 'localhost',
        port: 8081
    },
    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    }
};
