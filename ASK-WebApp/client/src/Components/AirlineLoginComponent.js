import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import axios from 'axios';

import PromptModal from './PromptModalComponent';


export default class AirlineLoginComponent extends Component{


constructor(props){
  super(props);
  this.state={
    airline:'',
    agent:'',
    password:''
  }
}
componentDidMount(){

}


onChange = (e)=>{
  this.setState({[e.target.id]: e.target.value});
}

onSubmit = (e)=>{
  let obj = {};
  e.preventDefault();
  obj.airline = this.state.airline;
  obj.agent = this.state.agent;
  obj.password = this.state.password;
  axios.post('/session/login', obj)
  .then((res)=>{
    localStorage.setItem('airline', this.state.airline);
    localStorage.setItem('agent', true);
    this.props.history.push('/airline_list');
    window.location.reload();
  })
  .catch((err)=>{
    console.log(err);
    this.setState({showModal: true, errorStatus:"Invalid Credentials"})
  })

}


render(){
  return (
    <div style={{marginTop: 10}}>
        <h3>Airline Login</h3>
        <form onSubmit={this.onSubmit}>
            <div className="form-group">
                <label>Agent Name: </label>
              <input type="text" className="form-control" id="agent"
                onChange={this.onChange}/>
            </div>

            <div className="form-group">
                <label>Airline: </label>
              <input type="text" className="form-control" id="airline"
                onChange={this.onChange}/>
            </div>


            <div className="form-group">
                <label>Password: </label>
                <input type="password" className="form-control" id="password"
                onChange={this.onChange}/>
            </div>

            <div className="form-group">
                <input type="submit" value="Login" className="btn btn-danger"/>
            </div>
            <div className={this.state.showModal ? 'alert alert-danger' : 'hidden' } role="alert">
                {this.state.errorStatus}
            </div>
        </form>
    </div>
  )
}



}
