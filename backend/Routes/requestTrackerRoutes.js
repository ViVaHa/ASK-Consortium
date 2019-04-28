const express = require('express');
const router = express.Router();
const key = require('../../keys');
const requestTracker = require('../models/requestTracker')

router.post('/add/', (req,res) =>{
    console.log(req.body.name);
    requestTracker.findOne({$and : [{customer_name:req.body.customer_name}, {from_airline_name : req.body.from_airline_name}, {from_flight_name:req.body.from_flight_name}, {status: {$ne: "complete"}}]})
      .then(details =>{
        if(details){
          res.status(400).json({error:' Already added'}, {errorCode : 2});
        }else{
          const newrequestTracker = new requestTracker({
            customer_name: req.body.customer_name,
            from_airline_name : req.body.from_airline_name,
            from_flight_name: req.body.from_flight_name,
            to_airline_name : req.body.to_airline_name,
            status : "To be Processed"
          });
          console.log(newrequestTracker);
          newrequestTracker.save()
          .then(details => res.status(200).json(details))
          .catch(err => console.log(err));
        }
      });


  });


  router.get('/listAll', (req, res)=>{
    requestTracker.find({},function(err,details){
        if(err){
            console.log(err);
        } else {
            res.json(details);
        }
    });
  });

  router.put('/update', (req,res) =>{
    console.log(req.body);
    requestTracker.updateOne({$and:[{ customer_name : req.body.customer_name}, {to_airline_name: req.body.to_airline_name}, {from_airline_name: req.body.from_airline_name}
        ,{ from_flight_name: req.body.from_flight_name }, {status :{$ne:"completed"}} ]} ,{ $set: {status: req.body.status } },   function(err, success){
        if(err){
          console.log(err);
        }else{
            if(success.n>0)
                res.status(200).json({"success" : true });
            else
                res.status(200).json({"Error": "No such request", errorCode:4})
        }
    });
  })








  router.get('/test', (req,res) =>{
    console.log("hi");
    res.json({"Hi":1});

  });


  module.exports= router;
