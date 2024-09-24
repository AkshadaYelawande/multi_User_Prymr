const path = require("path");

module.exports = {
  // Entry and output configurations (adjust as needed)
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  // Module rules (adjust as needed)
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: /node_modules/
      },
    ],
  },
  resolve: {
    fallback: {
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      buffer: require.resolve("buffer"),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      assert: require.resolve("assert"),
      os: require.resolve("os-browserify/browser"),
      url: require.resolve("url"),
      zlib: require.resolve("browserify-zlib"),
    },
  },node: {
    perf_hooks: 'empty',
  },
  devtool: false,
};
