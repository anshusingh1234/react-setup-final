const settings = {
  "config": {
    "ENV": process.env["NODE_ENV"],
    "PORT": process.env["PORT"],
    "ES_CONFIG": {
      "CONNECTION_STRING": process.env["ELASTIC_SEARCH:CONNECTION_STRING"],
      "LOG_LEVEL": process.env["ELASTIC_SEARCH:LOG_LEVEL"] || "info",
      "SERVER_API_VERSION": process.env["ELASTIC_SEARCH:SERVER_API_VERSION"] || "_default"
    },
    "LOG": {
      "PATH": process.env["LOG_PATH"],
      "LEVEL": process.env["LOG_LEVEL"] || "info"
    },
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
    },
    "CLOUDINARY": {
      "CLOUD_NAME": process.env["CLOUDINARY:CLOUD_NAME"],
      "API_KEY": process.env["CLOUDINARY:API_KEY"],
      "API_SECRET": process.env["CLOUDINARY:API_SECRET"]
    },
    "CLEVERTAP": {
      "ACCOUNT_NAME": process.env["CLEVERTAP:ACCOUNT_NAME"],
      "ACCOUNT_ID": process.env["CLEVERTAP:ACCOUNT_ID"],
      "PASSCODE": process.env["CLEVERTAP:PASSCODE"]
    },
    "SINCH": {
      "APPLICATION_KEY": process.env["SINCH:APPLICATION_KEY"],
      "SECRET_KEY": process.env["SINCH:SECRET_KEY"],
      "TOKEN": process.env["SINCH:TOKEN"],
      "PLAN_ID": process.env["SINCH:PLAN_ID"]
    },
    "FIREBASE": {
      "DATABASE_URL": process.env["FIREBASE_DB_URL"],
      "SERVICE_ACCOUNT_KEYS": {
        "type": process.env["FIREBASE_SERVICE_ACCOUNT_KEYS_type"],
        "project_id": process.env["FIREBASE_SERVICE_ACCOUNT_KEYS_project_id"],
        "private_key_id": process.env["FIREBASE_SERVICE_ACCOUNT_KEYS_private_key_id"],
        "private_key": process.env["FIREBASE_SERVICE_ACCOUNT_KEYS_private_key"],
        "client_email": process.env["FIREBASE_SERVICE_ACCOUNT_KEYS_client_email"],
        "client_id": process.env["FIREBASE_SERVICE_ACCOUNT_KEYS_client_id"],
        "auth_uri": process.env["FIREBASE_SERVICE_ACCOUNT_KEYS_auth_uri"],
        "token_uri": process.env["FIREBASE_SERVICE_ACCOUNT_KEYS_token_uri"],
        "auth_provider_x509_cert_url": process.env["FIREBASE_SERVICE_ACCOUNT_KEYS_auth_provider_x509_cert_url"],
        "client_x509_cert_url": process.env["FIREBASE_SERVICE_ACCOUNT_KEYS_client_x509_cert_url"]
      }
    },
    "ADMIN_USER_IDS": process.env["ADMIN_USER_IDS"].split(',')
  }
};

module.exports = settings;
