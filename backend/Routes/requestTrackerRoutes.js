const express = require('express');
const router = express.Router();
const key = require('../../keys');
const requestTracker = require('../models/requestTracker').requestTrackerConsortium;

router.post('/add', (req,res) =>{
    //console.log(req.body);
    requestTracker.findOne({$and : [{customer_name:req.body.customer_name}, {from_airline_name : req.body.from_airline_name}, {from_flight_name:req.body.from_flight_name}, {status: {$ne: "completed"}}]})
      .then(details =>{
        if(details){
          res.status(400);
          //console.log(details);
        }else{
          const newrequestTracker = new requestTracker({
            customer_name: req.body.customer_name,
            from_airline_name : req.body.from_airline_name,
            from_flight_name: req.body.from_flight_name,
            to_airline_name : req.body.to_airline_name,
            from:req.body.from,
            to:req.body.to,
            status : req.body.status,
            to_flight_name : req.body.to_flight_name
          });
          //console.log(newrequestTracker);
          newrequestTracker.save()
          .then((details) => {
            //console.log(details);
            res.status(200)})
          .catch(err => console.log(err));
        }
      });
      res.json({});

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
        ,{ from_flight_name: req.body.from_flight_name }, { to_flight_name: req.body.to_flight_name },{status :{$ne:"completed"}} ]} ,{ $set: {status: req.body.status } },   function(err, success){
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
