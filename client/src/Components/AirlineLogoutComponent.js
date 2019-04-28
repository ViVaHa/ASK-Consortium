import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';

import PromptModal from './PromptModalComponent';



export default class AirlineLoginComponent extends Component {
  constructor(){
      super();
      this.state = {
        showModal : false
      }
  }
  onChange = e =>{
    this.setState({[e.target.id] : e.target.value});
  }
  onSubmit = e =>{
    e.preventDefault();
    var agent = localStorage.getItem('agent');
    console.log("Success");

    this.setState({showModal : true});
  }
  logout = e => {
    localStorage.removeItem('agent');
    localStorage.removeItem('airline');
    this.props.history.push('/airline_login');
    window.location.reload();
    window.location.reload();
    this.setState({showModal : false});
  }
  close = e => {
    this.setState({showModal : false});
  }
    render() {
        return (
          <div style={{marginTop: 10}}>
              <h3>Logout</h3>
              <form onSubmit={this.onSubmit}>
                  <div className="form-group">
                      <p> Sure you want to logout? </p>
                      <input type="submit" value="Logout" className="btn btn-danger"/>
                  </div>
              </form>
          <PromptModal
            show = {this.state.showModal}
            primaryaction = {this.logout}
            close = {this.close}
            primarytext = "Logout"
            secondarytext = "Close"
            heading = "Do you want to logout for sure?"
            body = "If Yes Press Logout else click the button close"/>
          </div>
        )
    }
}
