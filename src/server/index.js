if(process.env.NODE_APP && (process.env.NODE_APP == 'production' || process.env.NODE_APP == 'stg')){
    require('newrelic');
}
require('@babel/polyfill');
require( "@babel/register" )({
    presets: ["@babel/preset-env", "@babel/preset-react"],
    plugins: ["dynamic-import-node"]
});
require('./server.js')