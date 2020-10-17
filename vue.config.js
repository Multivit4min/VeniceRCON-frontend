module.exports = {
  publicPath: process.env.GITHUB_ACTIONS ?
    `/${process.env.GITHUB_REPOSITORY.split("/")[1]}` :
    "/",
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