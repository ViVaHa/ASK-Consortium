const express = require('express');
const router = express.Router();
const validation = require('../functions/Registration');
const Agent = require('../models/agents');

router.post('/register', function(req, res) {
  let {errors, isValid} = validation(req.body);
  let obj = {}
  obj.name = req.body.agent;
  obj.airline = req.body.airline;
  obj.password = req.body.password;
  obj.status = "pending";

  if (Object.entries(errors).length === 0 && errors.constructor === Object) {
    Agent.findOne({airline: obj.airline}).then((agent) => {
      if (agent) {
        res.status(400).send("Already exists");
      } else {
        new Agent(obj).save().then((agent) => {
          res.status(200).send("Chairperson should approve");
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






router.get('/login', (req,res)=>{
  let {errors, isValid} = validation(req.body);
  let obj = {}
  obj.name = req.body.agent;
  obj.airline = req.body.airline;
  obj.password = req.body.password;
  if (Object.entries(errors).length === 0 && errors.constructor === Object) {
    Agent.findOne({airline:req.body.airline})
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
