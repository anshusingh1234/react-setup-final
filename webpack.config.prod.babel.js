import webpack from 'webpack';
import path from 'path';
import glob from 'glob';
import LoadablePlugin from '@loadable/webpack-plugin'
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";
import TerserPlugin from 'terser-webpack-plugin';
import PurgecssPlugin from 'purgecss-webpack-plugin';
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const BUILD_DIR = path.resolve( __dirname, "public" );
import WorkboxPlugin from 'workbox-webpack-plugin';
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const PATHS = {
    src: path.join(__dirname, 'src')
}
const service_worker = 'sw.js'

module.exports = {
    context: path.resolve( __dirname, "src" ),
    mode: 'production',
    entry: {
        main: './client/index.js',
        web: './scss/styles.scss'
    },
    devtool: false,
    //devtool: 'source-map',
    output: {
        path: BUILD_DIR+'/dist',
        filename: '[name].[hash].js',
        chunkFilename: '[name].[chunkhash].chunk.js',
        publicPath:'/dist/',
        pathinfo: false
    },
    resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'src'),
        ],
        extensions: ['.js', '.jsx', '.json']
    },
    stats: {
        colors: false,
        hash: true,
        timings: true,
        assets: true,
        chunks: true,
        chunkModules: true,
        modules: true,
        children: true,
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
                        importLoaders: 1,
                    }
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: false
                    }
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
        nodeEnv: 'production',
        splitChunks: {
            cacheGroups: {
                default: false,
                vendors: {
                    test: /[\\/]node_modules[\\/]/i,
                    chunks: "all",
                    name: "vendor"
                },
                commons: {
                    test: /\.js?x$/,
                    name: "commons",    // The name of the chunk containing all common code
                    chunks: "initial",  // TODO: Document
                    minChunks: 2,        // This is the number of modules
                },
                
            },
        },
        minimizer: [
            new OptimizeCSSAssetsPlugin({}),
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true,
                    },
                    extractComments: 'all',
                    cache: true,
                    parallel: true
                },
            })
        ],
        runtimeChunk: {
            name: "runtime"
        },
        mangleWasmImports: true,
        removeEmptyChunks: true
    },
    plugins: [
        new LoadablePlugin(),
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
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
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.LoaderOptionsPlugin( { minimize: true, debug: false } ),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new WorkboxPlugin.InjectManifest({ 
            swSrc: './src/client/sw.js',
            swDest: '../sw.js',
            precacheManifestFilename: 'wb-manifest.[manifestHash].js',
            include: [/\.html$/, /\.js$/, /\.css$/, /\.png$/, /\.jpg$/, /\.gif$/],
            exclude:[/^dist\/web\.css$/, /^dist\/web\.js$/, /^server\.js$/]
        }),
        //new BundleAnalyzerPlugin()
    ]
};