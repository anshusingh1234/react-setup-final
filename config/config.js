const _ = require('lodash');
const config = require('./config.json');
const envFile = `${__dirname }/../.env`;
const fs = require("fs");


const defaultConfig = config.development
const environment = JSON.parse(fs.readFileSync(envFile).toString());
//const environment= process.env.Node_ENV || 'staging';    
const environmentConfig = config[environment]
const finalConfig = _.merge(defaultConfig,environmentConfig)
global.gConfig = finalConfig;
 