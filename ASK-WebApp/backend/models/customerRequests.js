const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const databases = require('../DBConnections').databases;

let customerRequestsSchema = new Schema({
    airline_name :{
        type:String
    },
    customer_name:{
        type:String
    },
    from :{
        type:String
    },
    to :{
        type:String
    },
    flight_name:{

    },
    status:{
      type:String
    }

});


let customerRequests={}
customerRequests.customerRequestsA =  databases.dbA.model('customer_requests', customerRequestsSchema);
customerRequests.customerRequestsB =  databases.dbB.model('customer_requests', customerRequestsSchema);
customerRequests.customerRequestsC =  databases.dbC.model('customer_requests', customerRequestsSchema);

module.exports = customerRequests;
