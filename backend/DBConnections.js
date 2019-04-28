const db = require('../keys').mongoURI;
const mongoose = require('mongoose');
var dbConnectionA = mongoose.createConnection(db, {useNewUrlParser: true});
var dbConnectionB = dbConnectionA.useDb('AirlineB');

var obj={}
obj.connectionA = dbConnectionA;
obj.connectionB = dbConnectionB;


module.exports={
  databases : obj
}
