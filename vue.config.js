module.exports = {
  publicPath: process.env.GITHUB_ACTIONS ?
    `/${process.env.GITHUB_REPOSITORY.split("/")[1]}` :
    "/",
  configureWebpack: {
    devServer: {
      watchOptions: {
        ignored: ["node_modules"],
        aggregateTimeout: 300,
        poll: 1500
      },
      public: "ui.multivitamin.wtf"
    }
  },
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