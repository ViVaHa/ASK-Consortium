const express = require('express');
const router = express.Router();
const key = require('../../keys');
const flightDetails = require('../models/flightDetails')

router.post('/add', (req,res) =>{
    console.log(req.query.name);
    flightDetails.findOne({$and : [{name:req.query.name}, {airline_name:req.query.airline_name}]})
      .then(details =>{
        if(details){
          res.status(400).json({email:' Already added'});
        }else{
          const newflightDetails = new flightDetails({
            name: req.query.name,
            airline_name : req.query.airline_name,
            available_seats: req.query.seats,
            from :req.query.from,
            to :req.query.to,
            price: req.query.price
          });
          console.log(newflightDetails);
          newflightDetails.save()
          .then(details => res.status(200).json(details))
          .catch(err => console.log(err));
        }
      });


  });


  router.get('/info', (req, res)=>{
    console.log("Request for flight/info", req.query)
    flightDetails.findOne({$and:[{airline_name:req.query.airline_name}, {name :req.query.flight_name}]},function(err,details){
        if(err){
            console.log(err);
        } else {
            res.json(details);
        }
    });
  });

  router.get('/listAll', (req, res)=>{
    flightDetails.find({},function(err,details){
        if(err){
            console.log(err);
        } else {
            res.json(details);
        }
    });
  });

  router.put('/update', (req,res) =>{
    flightDetails.findOneAndUpdate({ name : req.query.name} ,{ available_seats : req.query.available_seats},   function(err, success){
        if(err){
          console.log(err);
        }else{
          res.status(200).json({"success" : true });
        }
    });
  })

  router.get('/alternateFlight', (req, res)=>{
    console.log("req for flight/alternateFlight", req.query);
    flightDetails.find({$and:[{from : req.query.from}, {to:req.query.to}, {airline_name:{$ne:req.query.airline_name}}]},function(err,details){
        if(err){
            console.log(err);
        } else {
            res.json(details);
        }
    });
  });

  router.get('/checkAvailability', (req, res)=>{
    console.log(req.query);
    flightDetails.findOne({$and : [{ airline_name : req.query.airline_name},{from : req.query.from}, {to: req.query.to},{available_seats : {$gt : 0}} ]},function(err,details){
        if(err){
            console.log(err);
        } else {
            if(details){
                res.json(details);
            }
            else{
                res.status(400).json({error:'No seat found', errorCode : 1});
            }

        }
    });
  });




  router.get('/test', (req,res) =>{
    console.log("hi");
    res.json({"Hi":1});

  });


  module.exports= router;
