const mongoose = require('mongoose')
global.Promise=mongoose.Promise;
const config = require('../config/config')
const host = `${global.gConfig.mongoHost}`;
const DB_URL = host;


mongoose.set('useFindAndModify', false);
mongoose.connection.openUri(DB_URL,{ useNewUrlParser: true , useUnifiedTopology:true})
mongoose.set('useCreateIndex', true);
/******************************** Events of mongoose connection. ******************************************************/
// CONNECTION EVENTS
// When successfully connected

mongoose.connection.on('connected',()=>{
console.log('success', 'Mongoose default connection open to ' +DB_URL)
});
// if the connection throw an error
mongoose.connection.on('error',(err)=>{
     console.log('error', 'Mongoose default connection error')
});
// when the connectio is disconnected
mongoose.connection.on('disconnected',()=>{
     console.log('disconnected', 'Mongoose detault connection is disconnected')
})
//if the node process ends,close the mongoose connection
process.on('SIGINT',()=>{
   mongoose.connection.close(()=>{
      console.log('warning','Mongoose default connection disconnected through app termination')
    });
});
