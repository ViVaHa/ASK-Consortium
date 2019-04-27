const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let airlineDetailsSchema = new Schema({
    airlineDetails_name:{
        type:String
    },
    
});


module.exports = airlineDetails =  mongoose.model('airlineDetails', airlineDetailsSchema);