const path = require("path");
const webpack = require("webpack");
const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require("html-webpack-plugin"); //生成HTML文件

module.exports = {
  entry: path.join(__dirname, "examples/src/index.js"), //入口文件
  output: {
    filename: "[name].bundle.js" //输出文件名
  },
  mode: "development",
  devtool: "cheap-module-source-map",
  resolve: {
    extensions: [".js", ".jsx", "tsx", "ts"]
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        include: /src/,
        exclude: /node_modules/
      },
      {
        test: /\.(js|jsx)$/,
        enforce: "pre",
        loader: "eslint-loader",
        exclude: /node_modules/
      },
      {
        test: /\.scss|css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader", options: { importLoaders: 1 } },
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: () => [
                require("postcss-flexbugs-fixes"),
                autoprefixer({
                  browsers: [
                    ">1%",
                    "last 4 versions",
                    "Firefox ESR",
                    "not ie < 9" // React doesn't support IE8 anyway
                  ],
                  flexbox: "no-2009"
                })
              ]
            }
          },
          { loader: "sass-loader" }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "examples/index.html"),
      filename: "./index.html"
    }),
    new webpack.HotModuleReplacementPlugin() //配合 webpack-dev-server启用HMR
  ],
  devServer: {
    port: 3000,
    open: true,
    hot: true
  }
};
