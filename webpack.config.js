const CopyWebpackPlugin = require('copy-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin')

// const pages = ['reviewerProfile', 'reviewCard'];

// const generateHtml = (pages) => {
//     return pages.map((i) => {
//         return new HtmlWebpackPlugin({
//             chunks: [i],
//             filename: `/views/${i}.ejs`,
//             // template: path.join('src', 'views', 'template.ejs')
//         })

//     })
// }

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
        extensions: [".webpack.js", ".web.js", "ejs", ".js", ".css"]
    },

    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: [/node_modules/],
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.ejs$/,
                use: {
                    loader: 'ejs-loader'
                }
            },
            // {
                // test: /\.(css)$/,
                // use: [MiniCssExtractPlugin.loader, 'css-loader']
                // use: {
                //     loader: MiniCssExtractPlugin.loader,
                //     options: {
                //         publicPath: '/dist/views'
                //     }
                // }
            // }
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/views', to: 'views' }
            ]
        }),
        // ...generateHtml(pages),
        // new MiniCssExtractPlugin({
        //     filename:  'css/[contentHash].css',
        //     chunkFilename: 'css/[contentHash].css'
        // }),
    ]
};