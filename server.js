const express = require('express')
const bodyParser = require("body-parser");
const config = require('./config/config')
const db = require('./dbConnectivity/mongodb')
const index = require('./routes/indexRoute')
const app = express()
const morgan = require('morgan');
const cors=require('cors')
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

app.use('/api/v1', index)

app.listen(global.gConfig.node_port, function () {

  console.log("Server is listening on", global.gConfig.node_port)

})



