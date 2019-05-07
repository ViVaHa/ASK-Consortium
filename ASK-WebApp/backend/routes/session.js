const express = require('express');
const router = express.Router();
const validation = require('../functions/Registration');
const Agent = require('../models/agents').agentConsortium;
const Mapping = require('../models/mapping').mappingConsortium;

router.post('/register', function(req, res) {
  let {errors, isValid} = validation(req.body);
  let obj = {}
  obj.name = req.body.agent;
  obj.airline = req.body.airline;
  obj.password = req.body.password;
  obj.status = "approved";



  // if airline===a{
  //  Agent = Agents.agentA;
  // }

  if (Object.entries(errors).length === 0 && errors.constructor === Object) {
    Agent.findOne({airline: obj.airline, status:"approved"}).then((agent) => {
      if (agent) {
        console.log('Already Exists');
        res.status(400).send({error:"Already Exists"});
      } else {
        new Agent(obj).save().then((agent) => {
          res.status(200).send("Entered the consortium");
        }).catch((err) => {
          console.log(err);
        })
      }
    })

  } else {
    console.log(errors);
    res.status(400).json(errors);
  }
})


router.post('/map',(req,res)=>{
  let obj={};
  obj.airline = req.body.airline;
  obj.address = req.body.address;
  Mapping.findOne({airline: obj.airline}).then((airline)=>{
    if(airline){
      console.log(airline);
      res.status(400).json(airline);
    }else{
      new Mapping(obj).save()
      .then((newAirline)=>{
        res.status(200).json(newAirline);
      })
      .catch((err)=>{
        console.log(err);
        res.status(400).json(err);
      })
    }
  })
  .catch((err)=>{
    console.log(err);
    res.status(400).json(err);
  })
})

router.post('/checkValid', (req,res)=>{
  Agent.findOne({airline: req.body.airline}).then((agent) => {
    if (agent) {
      console.log('Already Exists');
      res.status(400).send({error:"Already Exists"});
    } else {
      res.status(200).json('success: Can Register');
    }
  })

})


router.post('/deleteMapping', (req,res)=>{
  Mapping.deleteOne({airline:req.body.airline})
  .then((success)=>{
    //console.log(success);
    res.status(200).json(success);
  })
  .catch((err)=>{
    res.status(400).json(err);
  })
})




router.post('/login', (req,res)=>{
  let {errors, isValid} = validation(req.body);
  let obj = {}
  obj.name = req.body.agent;
  obj.airline = req.body.airline;
  obj.password = req.body.password;
  console.log(errors);
  if (Object.entries(errors).length === 0 && errors.constructor === Object) {
    Agent.findOne({$and : [{name:req.body.agent},{airline:req.body.airline},{status : {$eq:"approved"}}]})
    .then((agent)=>{
      if(!agent){
        res.status(400).send("No such user");
      }else{
        res.status(200).send("Logged In");
      }
    })
  }else{
    res.status(400).json(errors);
  }

})

module.exports = router;
