// Add this to the VERY top of the first file loaded in your app
require("string-format").extend(String.prototype);
const __initEnvSettings = require("./setting/loadSetting").initializeEnvironmentSettings();
const jConfig = require("./config/jigrrConfig").getConfig();

const express = require('express')
const bodyParser = require("body-parser");
const config = require('./config/config')
const db = require('./dbConnectivity/mongodb')
const index = require('./routes/indexRoute')
const v2Routes = require('./routes/v2')
const app = express()
const morgan = require('morgan');
const cors = require('cors');
const auth = require('./auth');
const mongo = require("./core/mongo/index");
const requestLogger = require('./routes/requestLogger');


app.use(cors());

///////////////////////////////////////////////////////////////Swagger//////////////////////////////////////////////////////////////////////////////

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

var swaggerDefinition = {
  info: {
    title: 'BUILD_SOCIAL_MEDIA',
    version: '2.0.0',
    description: 'Documentation of build social media ',
  },
  host: `${global.gConfig.swaggerURL}`,
  basePath: '/',
};
var options = {
  swaggerDefinition: swaggerDefinition,
  apis: ['./routes/*/*.js']
};

var swaggerSpec = swaggerJSDoc(options);

app.get('/swagger.json', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// initialize swagger-jsdoc
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb",parameterLimit: 1000000}));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(requestLogger());

// app.use(morgan('dev'))

// jConfig.ENV !== 'local' && app.all("/api/v1/*", auth);
// jConfig.ENV !== 'local' && app.all("/api/v2/*", auth);

app.all("/api/v2/topics/list", auth);

app.use('/api/v1', index)
app.use('/api/v2', v2Routes)

mongo.initMongoDB().then(() => {
  app.listen(jConfig.PORT, function () {
    console.log("Server is listening on", jConfig.PORT)
    
  });
}).catch(err=> {
  console.log("Error while initializing mongo", err);
  process.exit(1);
})
