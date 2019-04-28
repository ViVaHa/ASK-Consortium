const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const databases = require('../DBConnections').databases;

let airlineDetailsSchema = new Schema({
    name:{
        type:String
    },
    
});

let airlineDetails={}
airlineDetails.airlineDetailsConsortium =  databases.dbConsortium.model('airlineDetails', airlineDetailsSchema);


module.exports = airlineDetails ;