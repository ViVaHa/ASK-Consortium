const validator = require('validator');
const isEmpty = require('is-empty');


module.exports = function validate(data){
  let errors={}
  if(isEmpty(data.airline)){
    data.airlinesID="";
  }
  if(isEmpty(data.agent)){
    data.agent="";
  }
  if(isEmpty(data.password)){
    data.password="";
  }
  if(validator.isEmpty(data.airline)){
    errors.airline = "Airline is empty";
  }
  if(validator.isEmpty(data.agent)){
    errors.agent = "Agent name is empty";
  }
  if(validator.isEmpty(data.password)){
    errors.password = "Password is empty"
  }
  let isValid = isEmpty(errors);
  return {
    errors,
    isValid
  };
};
