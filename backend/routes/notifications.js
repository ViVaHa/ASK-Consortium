const express = require('express');
const router = express.Router();
const requestTracker = require('../models/requestTracker')

router.get('/airlines/dashboard', (req, res)=>{
  let airline = req.body.airline;
  requestTracker.find({$and : [{to_airline_name : airline}, {status:{$eq:"request_sent"}}]})
  .then((pending)=>{
    res.status(200).json(pending);
  })
  .catch((err)=>{
    res.status(400).json(err);
  })
});

router.get('/customer/dashboard', (req,res)=>{
  let customer = req.body.customer;
  requestTracker.find({$and : [{customer_name:customer}, {status:{$eq:"completed"}}]})
  .then((updates)=>{
    console.log(updates);
    res.status(200).json(updates);
  })
  .catch((err)=>{
    res.status(400).json(err);
  })
})


module.exports = router;
