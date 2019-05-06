const express = require('express');
const router = express.Router();

const Balances = require('../models/balances').balancesConsortium

const Agents = require('../models/agents').agentConsortium;


router.put('/updateBalances', (req,res)=>{
  let myOptions = { upsert: true, new: true, setDefaultsOnInsert: true };
  console.log(req.body);
  //console.log(typeof req.body.amount);
  Balances.findOneAndUpdate({$and:[{lender:req.body.lender}, {borrower:req.body.borrower}]}, { $inc: { amount: req.body.amount }}, myOptions)
  .then((updated)=>{
    console.log(updated);
    res.status(200).json(updated);
  })
  .catch((err)=>{
    console.log(err);
    res.status(400).json(err);
  })
})


router.put('/nullifyBalance', (req,res)=>{
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



router.get('/getCounterParts', (req,res)=>{
  let airline_name = req.query.airline_name;
  //console.log(airline_name);
  retObj=[]
  //var counterParts = getCounterParts(airline);
  Agents.find().distinct('airline', {'airline':{$ne: airline_name}})
  .then((counterParts)=>{
      res.status(200).json({counterParts:counterParts});
  })
  .catch((err)=>{
    console.log("ERROR");
  })
})


router.get('/amountLent', (req,res)=>{
  let lender = req.query.lender;
  let sum=0;
  Balances.find({lender:lender})
  .then((data)=>{
    res.status(200).json({result: data});
  })
  .catch((err)=>{
    console.log(err);
  })
})


router.get('/amountBorrowed', (req,res)=>{
  let lender = req.query.lender;
  let sum=0;
  Balances.find({borrower:lender})
  .then((data)=>{
    res.status(200).json({result: data});
  })
  .catch((err)=>{
    console.log(err);
  })
})





module.exports = router;
