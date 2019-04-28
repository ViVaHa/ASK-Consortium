import React, { Component } from 'react';
import axios from 'axios';
export default class AdminLogin extends Component{
  constructor(){
      super();
      this.state = {
        username : '',
        password : '',
        showModal : false,
        errorStatus : '',
        isAdmin : false
      }
  }
  onChange = e =>{
    this.setState({[e.target.id] : e.target.value});
    //console.log(e.target.value);
  }
  componentDidMount(){
    if(localStorage.getItem('admin')===true){
      this.props.history.push('/');
      window.location.reload();
    }
  }
  onSubmit = (e)=>{
    let obj = {};
    e.preventDefault();
    obj.username = this.state.username;
    obj.password = this.state.password;
    const config = { headers: {'Content-Type': 'application/json'} };
    let adminLoggedIn = localStorage.getItem('admin');
    if(adminLoggedIn===null || !adminLoggedIn){
      axios.post('admin/login/', obj, config)
      .then((res)=>{
        console.log(res.status);
        if(res.status===200){
          localStorage.setItem('admin',true);
          this.props.history.push('/');
          window.location.reload();
        }else{
          this.setState({errorStatus : 'Invalid Credentials'});
          this.setState({showModal : true});
        }
      })
      .catch((err)=>{
        console.log(err);
        this.setState({errorStatus : 'Invalid Credentials'});
        this.setState({showModal : true});
      })

    }
    e.preventDefault();
  }



  render(){
      return (
        <div style={{marginTop: 10}}>
            <h3>Login</h3>
            <form onSubmit={this.onSubmit}>
                <div className="form-group">
                    <label>Username: </label>
                  <input type="text" className="form-control" id="username"
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
      );
  }
}
