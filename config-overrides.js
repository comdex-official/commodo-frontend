const webpack = require('webpack');

module.exports = function override(config) {
  console.log("override");
  let loaders = config.resolve;
  loaders.fallback = {
    assets: false,
    fs: false,
    tls: false,
    net: false,
    buffer: false,
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    path: require.resolve("path-browserify"),
    stream: require.resolve("stream-browserify"),
    crypto: require.resolve("crypto-browserify"),
    os: require.resolve("os-browserify/browser"),
    zlib: require.resolve("browserify-zlib"),
    buffer: require.resolve("buffer"),
  };

  config.plugins = [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
  ];

  return config;
};
