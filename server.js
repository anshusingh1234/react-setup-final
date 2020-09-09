// Add this to the VERY top of the first file loaded in your app
require("string-format").extend(String.prototype);
const __initEnvSettings = require("./setting/loadSetting").initializeEnvironmentSettings();
const jConfig = require("./config/jigrrConfig").getConfig();

const express = require('express')
const bodyParser = require("body-parser");
const config = require('./config/config')
const db = require('./dbConnectivity/mongodb')
const index = require('./routes/indexRoute')
const app = express()
const morgan = require('morgan');
const cors = require('cors');
const auth = require('./auth');

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
app.use(morgan('dev'))

app.all("/api/v1/*", auth);

app.use('/api/v1', index)

app.listen(jConfig.PORT, function () {
  console.log("Server is listening on", jConfig.PORT)
})

// const instance = require("./core/elasticsearch/feeds").forDate("2020-09-10");
// instance.indexDoc({
//   feed_id: 'cdndskjnkmkasdkndsnjknsdk',
//   type: 'post',
//   content: 'This is my first es post',
//   tagged_users: ["njdnjkndskjnjkdsnjkdsn", "ajknjknjkdnkjdsnjh"],
//   check_in_text: 'Ambience Mall, Gurgaon, Haryana',
//   check_in_geo_points: [24.555, 54.878],
//   author: 'dkjnsjknjsdknjksdnsjkd',
//   privacy: 2
// }, (error, result) => {
//   console.log(error)
//   console.log(result)
// })
