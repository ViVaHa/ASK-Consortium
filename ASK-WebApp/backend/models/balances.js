const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const databases = require('../DBConnections').databases;

const balancesSchema = new Schema({
  lender:{
    type : String,
    required : true
  },
  borrower:{
    type: String,
    required : true
  },
  amount:{
    type : Number
  }
});

let Balances={}
Balances.balancesConsortium =  databases.dbConsortium.model('balances', balancesSchema);

module.exports = Balances;
