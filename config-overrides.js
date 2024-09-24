const path = require("path");

module.exports = function override(config, env) {
  config.resolve.fallback = {
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    buffer: require.resolve("buffer"),
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    assert: require.resolve("assert"),
    os: require.resolve("os-browserify/browser"),
    url: require.resolve("url"),
    zlib: require.resolve("browserify-zlib"),
  };

  return config;
};
