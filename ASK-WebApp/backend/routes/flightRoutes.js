const express = require('express');
const router = express.Router();
const key = require('../../keys');
const flightDetailsAll = require('../models/flightDetails')
const Mapping = require('../models/mapping').mappingConsortium;
function getDB(airline_name){
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

function getAlternateDB(airline_name, i){
    var flightDetails;
    if(airline_name=="Airline 1"){
        console.log(1)
        if(i==1)
            flightDetails = flightDetailsAll.flightDetailsB
        else
            flightDetails = flightDetailsAll.flightDetailsC
    }else if(airline_name=="Airline 2"){
        console.log(2)
        if(i==1)
            flightDetails = flightDetailsAll.flightDetailsA
        else
            flightDetails = flightDetailsAll.flightDetailsC
    }else if(airline_name=="Airline 3"){
        console.log(3)
        if(i==1)
            flightDetails = flightDetailsAll.flightDetailsB
        else
            flightDetails = flightDetailsAll.flightDetailsA
    }
    return flightDetails;
}
router.post('/add', (req,res) =>{
    console.log(req.query);
    var flightDetails=getDB(req.query.airline_name);
    flightDetails.findOne({$and : [{name:req.query.flight_name}, {airline_name:req.query.airline_name}]})
      .then(details =>{
        if(details){
          res.status(400).json({email:' Already added'});
        }else{
          const newflightDetails = new flightDetails({
            name: req.query.flight_name,
            airline_name : req.query.airline_name,
            available_seats: req.query.available_seats,
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
    var flightDetails=getDB(req.query.airline_name);
    flightDetails.findOne({$and :[{name:req.query.flight_name}, {airline_name:req.query.airline_name}]},function(err,details){
        if(err){
            console.log(err);
        } else {
            res.status(200).json(details);
        }
    });
  });

  router.get('/listAll', (req, res)=>{
    var flightDetails=getDB(req.query.airline_name);
    flightDetails.find({},function(err,details){
        if(err){
            console.log(err);
        } else {
            res.json(details);
        }
    });
  });


  router.get('/getPrice', (req, res)=>{
    let model=getDB(req.query.airline_name);
    //console.log(model);
    let flight_name = req.query.flight_name;

    model.findOne({$and :[{name:req.query.flight_name}, {airline_name:req.query.airline_name}]},function(err,details){
        if(err){
            console.log(err);
        } else {
            console.log(details);
            res.json(details.price);
        }
    });
  });




  router.put('/update', (req,res) =>{
    console.log(req.body);
    let model=getDB(req.body.airline_name);
    let increment = req.body.increment;
    model.findOneAndUpdate({ name : req.body.flight_name} ,{ $inc : {available_seats: increment}},   function(err, success){
        if(err){
          console.log(err);
        }else{
          res.status(200).json({"success" : true });
        }
    });
  })



function getCounterParts(airline){
  airlines=[];
  if(airline.localeCompare("Airline 1")===0){

    airlines.push("Airline 2");
    airlines.push("Airline 3");
  }else if(airline.localeCompare("Airline 2")===0){
    airlines.push("Airline 1");
    airlines.push("Airline 3");
  }else if(airline.localeCompare("Airline 3")===0){
    airlines.push("Airline 1");
    airlines.push("Airline 2");
  }
  return airlines;
}

  router.get('/alternateFlight', (req, res)=>{
    console.log("req for flight/alternateFlight", req.query);
    let airlines = getCounterParts(req.query.airline_name);
    var final=[];
    Mapping.findOne({airline:airlines[0]})
    .then((details)=>{
      if(details){
        let flightDetails = getDB(airlines[0]);
        flightDetails.find({$and: [{to:req.query.to}, {from:req.query.from}, {airline_name:{$eq:airlines[0]}}]})
        .then((flightDetailsA)=>{
            final.push(flightDetailsA);
            console.log("det 1 : ",flightDetailsA);
            Mapping.findOne({airline:airlines[1]})
            .then((details)=>{
              if(details){

                let flightDetails = getDB(airlines[1]);
                flightDetails.find({$and: [{to:req.query.to}, {from:req.query.from}, {airline_name:{$eq:airlines[1]}}]})
                .then((flightDetailsB)=>{
                  console.log("det 2 : ",flightDetailsB);

                    final.push(flightDetailsB);
                    res.json(final);
                })
              }else{
                console.log(final);
                res.json(final);
              }
            });
        })
      }else{
        Mapping.findOne({airline:airlines[1]})
        .then((details)=>{
          if(details){
            let flightDetails = getDB(airlines[1]);
            flightDetails.find({$and: [{to:req.query.to}, {from:req.query.from}, {airline_name:{$eq:airlines[1]}}]})
            .then((flightDetailsB)=>{
                final.push(flightDetailsB);
                res.json(final);
            })
          }else{
            console.log(final);
            res.json(final);
          }
        });
      }
    });


    // let obj={};
    // obj.airline = req.query.airline_name;
    // if( req.query.airline_name == "Airline 1"){
    //   Mapping.findOne({airline: "Airline 2"}).then((airline)=>{
    //     if(airline){
    //       console.log(airline);
    //       var flightDetails = getDB("Airline 2");
    //       flightDetails.find({$and:[{from : req.query.from}, {to:req.query.to}, {airline_name:{$ne:req.query.airline_name}}]},function(err,details){
    //       }
    //     }
    //   }
    // }







    // var flightDetails=getAlternateDB(req.query.airline_name,1);
    // flightDetails.find({$and:[{from : req.query.from}, {to:req.query.to}, {airline_name:{$ne:req.query.airline_name}}]},function(err,details){
    //     if(err){
    //         console.log(err);
    //     } else {
    //         var flightDetails=getAlternateDB(req.query.airline_name,2);
    //         flightDetails.find({$and:[{from : req.query.from}, {to:req.query.to}, {airline_name:{$ne:req.query.airline_name}}]},function(err,details2){
    //             if(err){
    //                 console.log(err);
    //             } else {
    //                 out= (details.concat(details2));
    //                 res.json(out);
    //             }
    //         });
    //     }
    // });
  });

  router.get('/checkAvailability', (req, res)=>{
    console.log(req.query);
    var flightDetails=getDB(req.query.airline_name);
    flightDetails.findOne({$and : [{ name : req.query.flight_name},{from : req.query.from}, {to: req.query.to},{available_seats : {$gt : 0}} ]},function(err,details){
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
    var flightDetails=getDB(req.query.airline_name);

    console.log(flightDetails);
    res.json({"Hi":1});

  });


  module.exports= router;
