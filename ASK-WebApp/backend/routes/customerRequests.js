const express = require('express');
const router = express.Router();
const key = require('../../keys');
const customerRequests = require('../models/customerRequests')
const flightDetailsAll = require('../models/flightDetails')

function getFlightModel(airline_name){
    var flightDetails;
    if(airline_name=="Airline 1"){
        console.log(1)
        flightDetails = flightDetailsAll.flightDetailsA
    }else if(airline_name=="Airline 2"){
        console.log(2)
        flightDetails = flightDetailsAll.flightDetailsB
    }else if(airline_name=="Airline 3"){
        console.log(3)
        flightDetails = flightDetailsAll.flightDetailsC
    }
    return flightDetails;
}

function getDB(airline_name){
    var customerRequestsDB;
    if(airline_name=="Airline 1"){
        console.log(1)
        customerRequestsDB = customerRequests.customerRequestsA;
    }else if(airline_name=="Airline 2"){
        console.log(2)
        customerRequestsDB = customerRequests.customerRequestsB;
    }else if(airline_name=="Airline 3"){
        console.log(3)
        customerRequestsDB = customerRequests.customerRequestsC;
    }
    return customerRequestsDB;
}


router.get('/getCustomerRequests', (req,res)=>{
  let airline = req.query.airline;
  console.log(airline);
  let customerRequestsDB = getDB(airline);
  customerRequestsDB.find({$and :[{airline_name:airline},{status:{$eq:"Customer_Requested"}}]})
  .then((details)=>{
    console.log(details);
    res.status(200).json(details);
  })
  .catch((err)=>{
    console.log(err);
  })
})


router.put('/update', (req,res)=>{
  let airline = req.body.airline;
  console.log(req.body);
  let customerRequestsDB = getDB(airline);
  customerRequestsDB.findOneAndUpdate({$and :[{airline_name:airline},{from:req.body.from},{customer_name:req.body.customer_name}, {to:req.body.to}]}, { $set: { status: req.body.status }})
  .then((details)=>{
    console.log(details);
    res.status(200).json(details);
  })
  .catch((err)=>{
    console.log(err);
  })
})



router.post('/add', (req,res)=>{
  console.log(req.body);
  let customerRequest = getDB(req.body.airline_name);
  let flightDetails = getFlightModel(req.body.airline_name);
  customerRequest.findOne({$and :[{airline_name:req.body.airline_name},{status:{$eq:"Customer_Requested"}},{flight_name : req.body.flight_name}]})
  .then((details)=>{
    if(details){
      res.status(400).json({status:"Already sent"});
    }else{
      flightDetails.findOne({$and :[{airline_name:req.body.airline_name},{name : req.body.flight_name}]})
      .then((flight)=>{
        console.log(flight);
        const newRequest = new customerRequest({
          customer_name : req.body.customer_name,
          flight_name : req.body.flight_name,
          from : flight.from,
          to : flight.to,
          airline_name : req.body.airline_name,
          status : "Customer_Requested",
        });
        newRequest.save()
        .then(details => res.status(200).json(details))
        .catch(err => console.log(err));
      })

    }
  })
  .catch((err)=>{
    console.log(err);
  })

})





module.exports = router;
