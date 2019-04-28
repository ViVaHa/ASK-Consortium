import React, {Component} from 'react';
import {Link, Switch} from 'react-router-dom';
import axios from 'axios';
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

  }
  onChange = (e)=>{
    this.setState({[e.target.id] : e.target.value});
  }
  onSubmit = (e)=>{
    e.preventDefault();
    let obj = {};
    obj.agent = this.state.name;
    obj.airline = this.state.airline;
    obj.password = this.state.airline;
    axios.post('/session/register', obj)
    .then((res)=>{
      if(res.status==200){
        console.log(res);
        this.props.history.push('/');
        window.location.reload();
      }else{
        console.log("Server Error");
      }
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
