const db = require('../keys').mongoURI;
const mongoose = require('mongoose');
var dbConnectionA = mongoose.createConnection(db, {useNewUrlParser: true});
var dbConnectionB = dbConnectionA.useDb('AirlineB');
var dbConnectionC = dbConnectionA.useDb('AirlineC');
var obj={}
obj.connectionA = dbConnectionA;
obj.connectionB = dbConnectionB;
obj.connectionC = dbConnectionC;

module.exports={
  databases : obj
}
