const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const dotenv = require("dotenv");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// Load environment variables from .env file
dotenv.config();

module.exports = (env, argv) => {
  const outputConsole = env.outputConsole === "true";
  console.log("oput", outputConsole);

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
      new CopyWebpackPlugin({
        patterns: [{ from: "public/locales", to: "locales" }],
      }),
    ],
    optimization: {
          minimize: true,
          minimizer: [
            new TerserPlugin({
              terserOptions: {
                compress: {
                  drop_console: !outputConsole, // Remove console logs
                  drop_debugger: true,
                  dead_code: true,// Eliminates unused code
                  unused: true,
                  passes: 3// Apply multiple compression passes
                },
                output: {
                  comments: false, // Remove comments
                },
              },
              extractComments: false,
            }),
          ],
     }
  };
};