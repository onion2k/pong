var path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
//const SriPlugin = require ('webpack-subresource-integrity');
// const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    mode: "development",
    entry: {
        app: ["./src/pong.js"]
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: "/",
        filename: "pong.js",
        crossOriginLoading: "anonymous"
    },
    devServer: {
        contentBase: path.join(__dirname, "assets"),
        port: 3000
    },
    module: {
        rules: [
            {
                test: /\.(glsl|frag|vert)$/,
                use: 'raw-loader'
            }
        ]
    },
    plugins: [
        new WebpackCleanupPlugin(),
        new HtmlWebpackPlugin(),
        // new UglifyJSPlugin(),
        // new SriPlugin({
        //     hashFuncNames: ['sha256', 'sha384'],
        //     enabled: true
        // }),
        new CopyWebpackPlugin([
          { from: 'assets' }
        ]),
        // new ExtractTextPlugin("pixelheart.css"),
    ]
};