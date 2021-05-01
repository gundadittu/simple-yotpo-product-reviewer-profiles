var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: __dirname + "/src/index.js",
    target: "node",
    output: {
        filename: "index.js",
        path: __dirname + "/dist"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".webpack.js", ".web.js", "ejs", ".js"]
    },

    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.ejs$/,
                use: { 
                    loader: 'ejs-loader'
                }
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/views', to: 'views' }
            ]
        })
    ]
};