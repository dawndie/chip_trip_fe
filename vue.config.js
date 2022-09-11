// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      "^/api": {
        target: "https://localhost:8081",
        ws: true,
        changeOrigin: true,
      },
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
    },
    public: "http://localhost:8081",
    disableHostCheck: true,
  },
};
