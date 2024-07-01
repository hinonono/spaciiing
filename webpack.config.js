const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const dotenv = require("dotenv");
const TerserPlugin = require('terser-webpack-plugin');

// Load environment variables from .env file
dotenv.config();

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

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
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
        filename: "index.html",
        chunks: ["bundle"], // Only include the 'bundle' entry in the HTML
      }),
      new webpack.DefinePlugin({
        "process.env.REACT_APP_ENV": JSON.stringify(process.env.REACT_APP_ENV),
      }),
    ],
    optimization: isProduction ? {
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
    } : {},
    devServer: {
      static: {
        directory: path.join(__dirname, "dist"),
      },
      compress: true,
      port: 9000,
    },
  };
};
