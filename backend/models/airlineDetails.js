const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const databases = require('../DBConnections').databases;

let airlineDetailsSchema = new Schema({
    name:{
        type:String
    },
    
});

let airlineDetails={}
airlineDetails.airlineDetailsA =  databases.connectionA.model('airlineDetails', airlineDetailsSchema);
airlineDetails.airlineDetailsB =  databases.connectionB.model('airlineDetails', airlineDetailsSchema);
airlineDetails.airlineDetailsC =  databases.connectionC.model('airlineDetails', airlineDetailsSchema);

module.exports = airlineDetails ;