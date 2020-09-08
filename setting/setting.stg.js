const settings = {
  "config": {
    "ENV": process.env["NODE_ENV"],
    "PORT": process.env["PORT"],
    "REDIS":{
      "PORT":process.env["REDIS:PORT"],
      "HOST":process.env["REDIS:HOST"],
      "PASSWORD":process.env["REDIS:PASSWORD"]
    },
    "MONGO":{
        "HOST":process.env["MONGO:HOST"],
        "DB_NAME":process.env["MONGO:DB_NAME"],
        "USER":process.env["MONGO:USER"],
        "PASS":process.env["MONGO:PASS"],
        "PORT":process.env["MONGO:PORT"],
        "REPLICA_SET":process.env["MONGO:REPLICA_SET"]
    }
  }
};

module.exports = settings;
