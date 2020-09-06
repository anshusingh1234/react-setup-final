/* eslint-disable global-require,no-console */
require("string-format").extend(String.prototype);

const jigrrConfig = require("../config/jigrrConfig");
const fs = require("fs");
const envFile = `${__dirname }/../.env`;

const loadSetting = {};

loadSetting.initializeEnvironmentSettings = () => {
  try {
    const nodeEnv = JSON.parse(fs.readFileSync(envFile).toString());

    console.log(`\n\x1b[33m Setting NODE Environment to \n${JSON.stringify(nodeEnv, null, 2)} "\x1b[0m\n`);
    Object.keys(nodeEnv).forEach((key) => {
      if (process.env[key] === undefined) {
        process.env[key] = nodeEnv[key];
      }
    });
    const config = (require(`./setting.${ nodeEnv.NODE_ENV}`)).config;

    jigrrConfig.setConfig(config);

  } catch (e) {
    console.log("Please ensure you have environments variables set properly. Please create a '.env' file in project root to load it from the file. Err:", e);
    process.exit(1);
  }
}

module.exports = loadSetting;