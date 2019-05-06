import React, {Component} from 'react';
import {Link, Switch} from 'react-router-dom';
import axios from 'axios';
import data from '../loadBlockChainData';
export default class AirlineRegisterComponent extends Component{
  constructor(props){
    super(props);
    this.state={
      airline:'',
      name: '',
      password: ''
    }
  }
  componentDidMount(){
    this.loadData();

  }
  async loadData(){
    this.data = await data;
    this.consortiumInstance = this.data.contract;
    this.web3 = this.data.web3;
    this.account = await this.web3.eth.getAccounts();

  }
  async getAccount(){
    this.account = await this.web3.eth.getAccounts();
    console.log(this.account);
  }
  onChange = (e)=>{
    this.setState({[e.target.id] : e.target.value});
  }
  onSubmit = (e)=>{
    e.preventDefault();

    //var account = this.web3.eth.accounts.defaultAccount;
    let obj = {};
    obj.airline = this.state.airline;
    axios.post('/session/checkValid')
    .then((res)=>{
      if(res.status==200){
        this.recordRegistration();
      }
    })
    .catch((err)=>{
      alert('Already exists');
    })
  }

  async recordRegistration(){
    this.account = await this.web3.eth.getAccounts();
    var acct = String(this.account);
    console.log(this.web3);
    this.consortiumInstance.methods.registerAirline().send({from: acct, value: this.web3.utils.toWei('50')})
    .on('transactionHash', (hash) => {
      console.log(hash);
    })
    .on('error',(err)=>{
      alert('Already Registered');
    })
    this.hash = null;
    this.consortiumInstance.events.Registered({filter: {fromBlock:'latest'}}, (error, event) => {
      console.log(this.hash);
      if(event && event.blockHash!=this.hash){
        this.hash = event.blockHash;
        console.log(this.event);
        console.log(event);
        let obj = {};
        obj.agent = this.state.name;
        obj.airline = this.state.airline;
        obj.password = this.state.airline;
        axios.post('/session/register', obj)
        .then((res)=>{
          if(res.status==200){
            console.log(res);
            this.mapAccount(acct);
            //alert('Registration complete');
            //this.props.history.push('/airline_login');

            //window.location.reload();
          }else{
            console.log("Server Error");
          }
        })
        .catch((err)=>{
          console.log(err);
        })
      }

    })
  }
  mapAccount = (acct)=>{
    let obj={};
    obj.airline = this.state.airline;
    obj.address = acct;
    axios.post('/session/map',obj)
    .then((res)=>{
      console.log(res);
    })
    .catch((err)=>{
      console.log(err);
    })

  }

  render(){
    return(
      <div style={{marginTop: 10}}>
          <h3>Registration</h3>
          <form onSubmit={this.onSubmit}>
              <div className="form-group">
                  <label>Name:  </label>
                  <input type="text" className="form-control" id="name"
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
                  <input type="submit" value="Register Yourself" className="btn btn-success"/>
              </div>
              <p> Already have account? <Link to ='/airline_login' >Click Here</Link></p>
          </form>

      </div>
    )
  }
}
