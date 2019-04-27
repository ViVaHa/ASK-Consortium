const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ticketDetailsSchema = new Schema({
    airline_name :{
        type:String
    },
    flight_name:{
        type:String
    },
    customer_name:{
        type:String
    }
    
});


module.exports = ticketDetails =  mongoose.model('ticketDetails', ticketDetailsSchema);