const express = require('express');
const router = express.Router();
const key = require('../../keys');
const flightDetails = require('../models/flightDetails')

router.post('/add/', (req,res) =>{
    console.log(req.body.name);
    flightDetails.findOne({name:req.body.name})
      .then(details =>{
        if(details){
          res.status(400).json({email:' Already added'});
        }else{
          const newflightDetails = new flightDetails({
            name: req.body.name,
            airline_name : req.body.airline_name,
            available_seats: req.body.seats,
            from :req.body.from,
            to :req.body.to,
            price: req.body.price
          });
          console.log(newflightDetails);
          newflightDetails.save()
          .then(details => res.status(200).json(details))
          .catch(err => console.log(err));
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
    flightDetails.findOneAndUpdate({ name : req.body.name} ,{ available_seats : req.body.available_seats},   function(err, success){
        if(err){
          console.log(err);
        }else{
          res.status(200).json({"success" : true });
        }
    });
  })



  router.get('/checkAvailability', (req, res)=>{
    console.log(req.body);
    flightDetails.findOne({$and : [{ airline_name : req.body.airline_name},{from : req.body.from}, {to: req.body.to},{available_seats : {$gt : 0}} ]},function(err,details){
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
