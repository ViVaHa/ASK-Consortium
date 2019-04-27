const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const agentsSchema = new Schema({
  name:{
    type : String,
    required : true
  },
  airline:{
    type: String,
    required : true
  },
  password:{
    type: String,
    required:true
  },
  status:{
    type : String
  }
});

module.exports = Agent = mongoose.model("agents", agentsSchema);
