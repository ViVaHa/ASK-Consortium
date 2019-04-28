const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const databases = require('../DBConnections').databases;

let requestTrackerSchema = new Schema({
    from_airline_name :{
        type:String
    },
    to_airline_name:{
        type:String
    },
    customer_name:{
        type:String
    },
    from_flight_name :{
        type:String
    },
    to_flight_name :{
        type:String
    },
    from:{
        type:String
    },
    to:{
        type:String
    },
    status:{
        type:String
    }

});



let requestTracker={}
requestTracker.requestTrackerA =  databases.connectionA.model('requestTracker', requestTrackerSchema);
requestTracker.requestTrackerB =  databases.connectionB.model('requestTracker', requestTrackerSchema);
requestTracker.requestTrackerC =  databases.connectionC.model('requestTracker', requestTrackerSchema);

module.exports = requestTracker ;

