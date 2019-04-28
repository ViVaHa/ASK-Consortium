const express = require('express');
const router = express.Router();
const key = require('../../keys');
const ticketDetails = require('../models/ticketDetails')

router.post('/add/', (req,res) =>{
    console.log(req.body.name);
    ticketDetails.findOne({$and : [{customer_name:req.body.customer_name}, {airline_name : req.body.airline_name}, {flight_name:req.body.flight_name}]})
      .then(details =>{
        if(details){
          res.status(400).json({error:' Already added'}, {errorCode : 2});
        }else{
          const newticketDetails = new ticketDetails({
            customer_name: req.body.customer_name,
            airline_name : req.body.airline_name,
            flight_name: req.body.flight_name,

          });
          console.log(newticketDetails);
          newticketDetails.save()
          .then(details => res.status(200).json(details))
          .catch(err => console.log(err));
        }
      });


  });

  router.get('/customers', (req, res)=>{
    console.log("Request for tickets/customers", req.query);
    ticketDetails.find({airline_name : req.query.airline_name, flight_name:req.query.flight_name},function(err,details){
        if(err){
            console.log(err);
        } else {
            res.json(details);
        }
    });
  });

  router.get('/flights', (req, res)=>{
    console.log("Request for tickets/flights", req.query);
    ticketDetails.distinct('flight_name',{airline_name : req.query.airline_name},function(err,details){
        if(err){
            console.log(err);
        } else {
            res.json(details);
        }
    });
  });


  router.get('/listAll', (req, res)=>{
    ticketDetails.find({},function(err,details){
        if(err){
            console.log(err);
        } else {
            res.json(details);
        }
    });
  });

  router.put('/update', (req,res) =>{
    console.log(req.body);
    ticketDetails.updateOne({$and:[{ customer_name : req.body.customer_name}, {airline_name: req.body.old_airline_name},{ flight_name: req.body.old_flight_name } ]} ,{ $set: {airline_name: req.body.new_airline_name, flight_name: req.body.new_flight_name } },   function(err, success){
        if(err){
          console.log(err);
        }else{
            if(success.n>0) {

              res.status(200).json({"success" : true });
            }

            else
                res.status(200).json({"Error": "No such ticket", errorCode:3})
        }
    });
  })



  router.get('/validateTicket', (req, res)=>{
    console.log(req.body);
    ticketDetails.findOne({$and : [{ airline_name : req.body.airline_name},{flight_name : req.body.flight_name}, {customer_name: req.body.customer_name} ]},function(err,details){
        if(err){
            console.log(err);

        } else {
            if(details){
                res.json(details);
            }

            else{
                res.status(400).json({error:'No ticket found', errorCode : 3});
            }

        }
    });
  });




  router.get('/test', (req,res) =>{
    console.log("hi");
    res.json({"Hi":1});

  });


  module.exports= router;
