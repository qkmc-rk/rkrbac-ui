module.exports = {
    publicPath: './',
    devServer: {
        open: true,
        host: 'localhost',
        port: 8521
    },
    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    }
};
