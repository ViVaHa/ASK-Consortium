const express = require('express');
const router = express.Router();
const key = require('../../keys');
const airlineDetails = require('../models/airlineDetails')

router.post('/register/', (req,res) =>{
    console.log(req.query.name);
    airlineDetails.findOne({name:req.query.name})
      .then(details =>{
        if(details){
          res.status(400).json({email:' Already Registered'});
        }else{
          const newairlineDetails = new airlineDetails({
            name: req.query.name
          });
          console.log(newairlineDetails);
          newairlineDetails.save()
          .then(details => res.status(200).json(details))
          .catch(err => console.log(err));
        }
      });
    
  
  });


  router.get('/test', (req,res) =>{
    console.log("hi"); 
    res.json({"Hi":1});
  
  });


  module.exports= router;