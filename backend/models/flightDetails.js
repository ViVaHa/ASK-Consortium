const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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


module.exports = flightDetails =  mongoose.model('flightDetails', flightDetailsSchema);