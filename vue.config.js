module.exports = {
  devServer: {
    disableHostCheck: true,
    proxy: {
      '^/api': {
        target: "http://10.10.12.111:8000",
        ws: true,
        changeOrigin: true
      }
    }
  }
}