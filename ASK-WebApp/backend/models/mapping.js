const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const databases = require('../DBConnections').databases;

const mappingSchema = new Schema({
  airline:{
    type : String,
    required : true
  },
  address:{
    type: String,
    required : true
  }
});

let Mapping={}
Mapping.mappingConsortium =  databases.dbConsortium.model('mapping', mappingSchema);

module.exports = Mapping;
