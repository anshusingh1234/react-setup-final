const mongoDB = require("./db");

const initMongoDB = async () => {
  await mongoDB.connect();
}

export {
  initMongoDB,
  mongoDB
};
