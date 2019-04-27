const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let airlineDetailsSchema = new Schema({
    name:{
        type:String
    },
    
});


module.exports = airlineDetails =  mongoose.model('airlineDetails', airlineDetailsSchema);