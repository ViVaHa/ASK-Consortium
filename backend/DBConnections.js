const db = require('../keys').mongoURI;
const mongoose = require('mongoose');
var dbConnectionA = mongoose.createConnection(db, {useNewUrlParser: true});
var dbConnectionB = dbConnectionA.useDb('AirlineB');
var dbConnectionC = dbConnectionA.useDb('AirlineC');
var dbConnectionConsortium = dbConnectionA.useDb('Consortium');
var obj={}
obj.dbA = dbConnectionA;
obj.dbB = dbConnectionB;
obj.dbC = dbConnectionC;
obj.dbConsortium = dbConnectionConsortium;

module.exports={
  databases : obj
}
