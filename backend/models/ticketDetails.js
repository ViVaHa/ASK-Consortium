const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const databases = require('../DBConnections').databases;

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


let ticketDetails={}
ticketDetails.ticketDetailsA =  databases.connectionA.model('ticketDetails', ticketDetailsSchema);
ticketDetails.ticketDetailsB =  databases.connectionB.model('ticketDetails', ticketDetailsSchema);
ticketDetails.ticketDetailsC =  databases.connectionC.model('ticketDetails', ticketDetailsSchema);


module.exports = ticketDetails ;