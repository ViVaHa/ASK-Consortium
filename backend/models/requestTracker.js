const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    status:{
        type:String
    }
    
});


module.exports = requestTracker =  mongoose.model('requestTracker', requestTrackerSchema);