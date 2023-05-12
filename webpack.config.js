const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin");
const globule = require("globule");

const targetTypes = { ejs: "html", js: "js" };

// ejsを見つける
const getEntriesList = (targetTypes) => {
  const entriesList = {};
  for (const [srcType, targetType] of Object.entries(targetTypes)) {
    const filesMatched = globule.find(
      [`**/*.${srcType}`, `!**/_*.${srcType}`],
      { cwd: `${__dirname}/src` }
    );

    for (const srcName of filesMatched) {
      const targetName = srcName.replace(
        new RegExp(`.${srcType}$`, "i"),
        `.${targetType}`
      );
      entriesList[targetName] = `${__dirname}/src/${srcName}`;
    }
  }
  return entriesList;
};

const app = {
  entry: getEntriesList(targetTypes),
  // mode: "development",
  // watch: true,
  entry: "./src/javascript/index.js",
  output: {
    path: `${__dirname}/public`,
    filename: "js/index.js",
    publicPath: "/",
    assetModuleFilename: "[name][ext][query]",
  },
  module: {
    rules: [
      {
        test: /\.ejs$/,
        use: ["html-loader", "ejs-html-loader"],
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        type: "asset",
      },
      // Sassファイルの読み込みとコンパイル
      {
        test: /\.scss/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              // オプションでCSS内のurl()メソッドの取り込みを禁止する
              url: false,

              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
              importLoaders: 2,
            },
          },
          {
            loader: "sass-loader",
            options: {},
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/index.css",
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, "public"),
    open: true,
    port: 8087,
    historyApiFallback: true,
    watchContentBase: true,
    hot: true,
    inline: true,
  },
};

// ejsを見つけてhtmlにする
for (const [targetName, srcName] of Object.entries(
  getEntriesList({ ejs: "html" })
)) {
  app.plugins.push(
    new HtmlWebpackPlugin({
      filename: targetName,
      template: srcName,
    })
  );
}

module.exports = app;
