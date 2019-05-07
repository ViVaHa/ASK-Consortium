import React, {Component} from 'react';
import {Link, Switch} from 'react-router-dom';
import axios from 'axios';
import AlertModal from './AlertModalComponent'
export default class CustomerComponent extends Component{
  constructor(props){
    super(props);
    this.state={
      airline:'',
      name: '',
      password: '',
      showModal:false
    }
  }
  componentDidMount(){

  }

  alertClose = e =>{
    this.setState({showAlertModal : false});
    this.props.history.push('/flight_change');
    window.location.reload();
  }

  onChange = (e)=>{
    this.setState({[e.target.id] : e.target.value});
  }
  onSubmit = (e)=>{
    var current = this;
    e.preventDefault();

    var listLink = "ticket/validateTicket/" ;
    axios.get(listLink, {params : {"airline_name" : this.state.airline_name, "flight_name":this.state.flight_name, "customer_name":this.state.customer_name}})
    .then(response =>{
        if(response.status==200){
          let obj = {};
          obj.customer_name=this.state.customer_name;
          obj.airline_name = this.state.airline_name;
          obj.flight_name = this.state.flight_name;
          axios.post('customerRequests/add', obj)
          .then((res)=>{
            //console.log(res);
            this.setState({modalText : "Requested successfully"},()=>{
              this.setState({showModal:true});
            })
          })
          .catch((err)=>{
            this.setState({modalText : "You already requested. Cannot Request multiple times!"},()=>{
              this.setState({showModal:true});
            })
            console.log(err);
          })
        }else{
          this.setState({modalText : "You are not a valid ticket holder"},()=>{
            this.setState({showModal:true});
          })
        }
    })
    .catch(function(error){
      current.setState({modalText : "You are not a valid ticket holder"},()=>{
        current.setState({showModal:true});
      })
        console.log(error);
    })
    //this.loadData();

  }



  render(){
    return(
      <div style={{marginTop: 10}}>
          <h3>Registration</h3>
          <form onSubmit={this.onSubmit}>
              <div className="form-group">
                  <label>Name:  </label>
                <input type="text" className="form-control" id="customer_name"
                  onChange={this.onChange}/>
              </div>
              <div className="form-group">
                  <label>Airline: </label>
                <input type="text" className="form-control" id="airline_name"
                  onChange={this.onChange}/>
              </div>
              <div className="form-group">
                  <label>Flight Name: </label>
                <input type="text" className="form-control" id="flight_name"
                  onChange={this.onChange}/>
              </div>

              <div className="form-group">
                  <input type="submit" value="Request Flight Change" className="btn btn-success"/>
              </div>
              <AlertModal
                  show = {this.state.showModal}
                  close = {this.alertClose}
                  heading = {this.state.modalHeading}
                  body = {this.state.modalText}
                  text = "Close"/>
          </form>

      </div>
    )
  }
}
