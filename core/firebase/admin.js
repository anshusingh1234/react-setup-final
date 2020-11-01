const jConfig = require("../../config/jigrrConfig").getConfig();
const admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.cert(jConfig.FIREBASE.SERVICE_ACCOUNT_KEYS),
    databaseURL: jConfig.FIREBASE.DATABASE_URL
});

module.exports = admin;