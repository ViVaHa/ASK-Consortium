const express = require('express');
const router = express.Router();

const Balances = require('../models/balances').balancesConsortium



router.put('/updateBalances', (req,res)=>{
  let myOptions = { upsert: true, new: true, setDefaultsOnInsert: true };
  //console.log(req.body);
  //console.log(typeof req.body.amount);
  Balances.findOneAndUpdate({$and:[{lender:req.body.lender}, {borrower:req.body.borrower}]}, { $set: { amount: req.body.amount }}, myOptions)
  .then((updated)=>{
    console.log(updated);
    res.status(200).json(updated);
  })
  .catch((err)=>{
    console.log(err);
    res.status(400).json(err);
  })
})





module.exports = router;
