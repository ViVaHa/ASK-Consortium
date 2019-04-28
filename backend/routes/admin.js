const express = require('express');
const router = express.Router();
const Agent = require('../models/agents');


router.post('/login', (req,res)=>{
  console.log(req.body);
  let username = req.body.username;
  let password = req.body.password;
  console.log(username);
  if(("admin".localeCompare(username)==0) && ("admin".localeCompare(password)==0)){
    res.status(200).send("Logged In");
  }else{
    res.status(400).send("Invalid credentials");
  }
})

router.get('/list', (req,res)=>{
  Agent.find({status:{$ne:'dismissed'}})
  .then((pending_airlines)=>{
    if(pending_airlines){
      res.status(200).json(pending_airlines);
    }else{
      res.status(200).send("No pending requests");
    }
  })
  .catch((err)=>{
    res.status(400).json(err);
  })
})


router.put('/update', (req,res)=>{
  let _airline = req.body.airline;
  let _status = req.body.status;
  let _action = req.body.action
  Agent.findOneAndUpdate({$and : [{airline : _airline},{status:_status}]},{$set : {status: _action}}, {new: true})
  .then((doc)=>{
    res.status(200).json(doc);
  })
  .catch((err)=>{
    res.status(400).json(err);
  })
})


module.exports = router;
