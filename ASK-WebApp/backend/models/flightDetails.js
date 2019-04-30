const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const databases = require('../DBConnections').databases;

let flightDetailsSchema = new Schema({
    airline_name :{
        type:String
    },
    name:{
        type:String
    },
    available_seats:{
        type:Number 
    },
    from :{
        type:String
    },
    to :{
        type:String
    },
    price:{
        type:Number
    }
    
});


let flightDetails={}
flightDetails.flightDetailsA =  databases.dbA.model('flightDetails', flightDetailsSchema);
flightDetails.flightDetailsB =  databases.dbB.model('flightDetails', flightDetailsSchema);
flightDetails.flightDetailsC =  databases.dbC.model('flightDetails', flightDetailsSchema);

module.exports = flightDetails ;