const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  // Define the entry point of your application
  entry: "./src/index.js",

  // Define the output directory and filenames
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },

  // Define module rules for your loaders
  module: {
    rules: [
      {
        test: /\.js$/, // Apply this rule to JavaScript files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader", // Use babel-loader to transpile JavaScript files
          options: {
            presets: ["@babel/preset-env", "react-app"], // Presets used for Babel
          },
        },
      },
      {
        test: /\.(css|sass|scss)$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        issuer: /\.[jt]sx?$/,
        use: ["url-loader"],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
  // Define a fallback for the 'url' module (Webpack 5 no longer polyfills Node.js core modules)
  resolve: {
    fallback: {
      url: require.resolve("url/"),
    },
  },

  // Define development options
  devServer: {
    static: "./dist",
  },

  // Set the mode to development or production
  mode: "development",
};
