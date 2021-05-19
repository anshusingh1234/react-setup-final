import webpack from 'webpack';
import path from 'path';
import glob from 'glob';
import LoadablePlugin from '@loadable/webpack-plugin'
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import PurgecssPlugin from 'purgecss-webpack-plugin';
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const BUILD_DIR = path.resolve( __dirname, "public" );
import WorkboxPlugin from 'workbox-webpack-plugin';
import config from "./src/config/index";

const PATHS = {
    src: path.join(__dirname, 'src')
}
const service_worker = 'sw.js'

let plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            NODE_APP: JSON.stringify(process.env.NODE_APP),
            SERVICE_WORKER: JSON.stringify(service_worker + '?' + Date.now())
        }
    }),
    new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[name].css"
    }),
    new PurgecssPlugin({
        paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
        whitelistPatterns: [/^slick-/],
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new LoadablePlugin(),
    new WorkboxPlugin.InjectManifest({ 
        swSrc: './src/client/sw.js',
        swDest: '../sw.js',
        precacheManifestFilename: 'wb-manifest.[manifestHash].js',
        include: [/\.html$/, /\.js$/, /\.css$/, /\.png$/, /\.jpg$/, /\.gif$/],
        exclude:[/^dist\/web\.css$/, /^dist\/web\.js$/, /^server\.js$/]
    })
]

if(process.env.NODE_ENV == 'analyze'){
    plugins.push(new BundleAnalyzerPlugin());
}
module.exports = {
    context: path.resolve( __dirname, "src" ),
    mode: 'development',
    entry: {
        main: './client/index.js',
        web: './scss/styles.scss',
        vendor: [
            '@babel/polyfill',
            'regenerator-runtime',
            'react',
            'react-dom',
            'redux',
            'react-redux',
            'react-router',
            'react-router-dom',
            'react-helmet-async',
        ]
    },
    devtool: 'inline-source-map',
    output: {
        path: BUILD_DIR+'/dist',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js',
        publicPath:'/dist/'
    },
    resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'src'),
        ],
        extensions: ['.js', '.jsx', '.json', '.svg']
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components|public\/)/,
            use: {
                loader: 'babel-loader'
            },
        }, {
            test: /\.(sa|sc|c)ss$/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {
                        modules: false,
                        importLoaders: 2,
                    }
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: false                    }
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: false,
                        plugins: function () {
                            return [
                                require('autoprefixer'),
                            ];
                        }
                    }
                }
            ]
        }, {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            exclude: /node_modules/,
            loader: 'file-loader?name=fonts/[name].[ext]&limit=1024',
        }, {
            test: /\.(jpg|jpeg|gif|png|svg)$/i,
            exclude: /node_modules/,
            loader: 'file-loader?name=images/[name].[ext]&limit=1024',
        }],
    },
    optimization: {
        nodeEnv: 'development',
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                    minChunks: 2,
                },
                default: false,
                /*styles: {
                    test: /\.s?css$/,
                    name: 'styles',
                    chunks: 'all',
                    minChunks: 1,
                    reuseExistingChunk: true,
                    enforce: true,
                }*/
            },
        },
        runtimeChunk: false,
        mangleWasmImports: true,
        mergeDuplicateChunks: false,
        removeEmptyChunks: false
    },
    plugins
};