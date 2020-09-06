let __config = {};
let config = {
  getConfig: () => {
    return __config;
  },

  setConfig: (envConfig) => {
    __config = envConfig;
  }
};

module.exports = config;
