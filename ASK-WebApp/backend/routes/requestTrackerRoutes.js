const express = require('express');
const router = express.Router();
const key = require('../../keys');
const requestTracker = require('../models/requestTracker').requestTrackerConsortium;
const Mapping = require('../models/mapping').mappingConsortium;

router.post('/add', (req,res) =>{
    //console.log(req.body);
    requestTracker.findOne({$and : [{customer_name:req.body.customer_name}, {from_airline_name : req.body.from_airline_name}, {from_flight_name:req.body.from_flight_name}, {status: {$eq: "request_sent"}}]})
      .then(details =>{
        if(details){
          res.status(400).json({error: 'Already Requested'});
          console.log(details);
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

            res.status(200).json({success:'Added Succesfully'});
          })
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



  router.get('/airlineMapping', (req,res)=>{
    Mapping.findOne({airline:req.query.airline}, function(err,details){
      if(!err){
        res.status(200).json(details);
      }else{
        res.status(400).json(err);
      }
    });

  })

  router.put('/update', (req,res) =>{
    console.log(req.body);
    requestTracker.updateOne({$and:[{ customer_name : req.body.customer_name}, {to_airline_name: req.body.to_airline_name}, {from_airline_name: req.body.from_airline_name}
        ,{ from_flight_name: req.body.from_flight_name }, { to_flight_name: req.body.to_flight_name },{status :{$eq:"request_sent"}} ]} ,{ $set: {status: req.body.status } },   function(err, success){
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



router.post('/delete', (req,res)=>{
  requestTracker.deleteMany({$and:[
    {$or:[{from_airline_name : req.body.airline}, {to_airline_name:req.body.airline}]},
    {status:{$eq:'request_sent'}}
  ]})
  .then((result)=>{
    //console.log(result);
    res.status(200).json(result);
  })
  .catch((err)=>{
    console.log(err);
    res.status(400).json(err);
  })
})





  router.get('/test', (req,res) =>{
    console.log("hi");
    res.json({"Hi":1});

  });


  module.exports= router;
