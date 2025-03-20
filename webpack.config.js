const webpack = require("webpack");
const dotenv = require("dotenv");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const HtmlInlineScriptPlugin = require("html-inline-script-webpack-plugin").default;
const HtmlInlineCSSPlugin = require("html-inline-css-webpack-plugin").default;
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// Load environment variables from .env file
dotenv.config();

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    mode: argv.mode, // Use the mode passed by the CLI
    entry: {
      bundle: "./src/index.tsx",
      code: "./src/plugin.ts",
    },
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "dist"),
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "style.css", // This CSS will be inlined
      }),
      new HtmlWebpackPlugin({
        template: "./src/index.html",
        filename: "index.html",
        inject: "body",
        chunks: ["bundle"], // Only include the 'bundle' entry in the HTML
        minify: isProduction
          ? {
              collapseWhitespace: true,
              removeComments: true,
            }
          : false,
        scriptLoading: "blocking",
      }),
      // new HtmlInlineScriptPlugin({
      //   scriptMatchPattern: [/bundle.js$/], // Inline only 'bundle.js'
      // }),
      new webpack.DefinePlugin({
        "process.env.REACT_APP_ENV": JSON.stringify(process.env.REACT_APP_ENV),
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: "public/locales", to: "locales" }],
      }),
      new HtmlInlineCSSPlugin(), // ✅ Inlines styles.css into index.html
    ],
    optimization: isProduction
      ? {
          minimize: true,
          minimizer: [
            new TerserPlugin({
              terserOptions: {
                compress: {
                  drop_console: true, // Remove console logs
                },
                output: {
                  comments: false, // Remove comments
                },
              },
              extractComments: false,
            }),
          ],
        }
      : {},
    // devServer: {
    //   static: [
    //     {
    //       directory: path.join(__dirname, "dist"),
    //     },
    //     {
    //       directory: path.join(__dirname, "public"),
    //     },
    //   ],
    //   compress: true,
    //   port: 9000,
    // },
  };
};
