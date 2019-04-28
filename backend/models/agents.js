const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const databases = require('../DBConnections').databases;

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

let Agents={}
Agents.agentA =  databases.connectionA.model('agents', agentsSchema);
Agents.agentB =  databases.connectionB.model('agents', agentsSchema);
Agents.agentC =  databases.connectionC.model('agents', agentsSchema);



module.exports = Agents;
