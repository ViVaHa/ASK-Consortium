const db = require('../keys').mongoURI;
const mongoose = require('mongoose');
var dbConnectionConsortium = mongoose.createConnection(db, {useNewUrlParser: true});
var dbConnectionB = dbConnectionConsortium.useDb('AirlineB');
var dbConnectionC = dbConnectionConsortium.useDb('AirlineC');
var dbConnectionA = dbConnectionConsortium.useDb('AirlineA');
var obj={}
obj.dbA = dbConnectionA;
obj.dbB = dbConnectionB;
obj.dbC = dbConnectionC;
obj.dbConsortium = dbConnectionConsortium;

module.exports={
  databases : obj
}
