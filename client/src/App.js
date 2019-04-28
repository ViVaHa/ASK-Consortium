import React from 'react';
import logo from './logo.svg';
import "bootstrap/dist/css/bootstrap.min.css";
import TodosList from './Components/CustomerList';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminLogin from './Components/AdminLogin'
import AdminLogout from './Components/AdminLogout'
import AdminManagementComponent from './Components/AdminManagementComponent'
import AirlineRegisterComponent from './Components/AirlineRegisterComponent'
import AirlineLoginComponent from './Components/AirlineLoginComponent'
class App extends React.Component {
  constructor(){
    super();
    this.state = {
      isLoggedIn:false
    }
  }
  componentDidMount(){

    console.log(localStorage.getItem('admin'));
    let adminLoggedIn = localStorage.getItem('admin');
    if(adminLoggedIn){
      this.setState({isLoggedIn:true});
      console.log(localStorage.getItem('admin'));
    }else{
      this.setState({isLoggedIn:false});
    }
    //this.setState({isLoggedIn:true});
    //console.log(this.state);
  }
  render() {
    return (<Router>
      <div className='container'>
        <nav className="navbar navbar-expand-lg navbar-light bg-light scrolling-navbar ">
          <Link to={'/'} className="navbar-brand">BlockChain</Link>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to={'/'} className="nav-link">Home</Link>
              </li>
              <li className={this.state.isLoggedIn
                  ? 'hidden'
                  : 'nav-item'}>
                <Link to={'/airline_register'} className="nav-link">Register</Link>
              </li>
              <li className={this.state.isLoggedIn? 'hidden': 'nav-item'}>
                <Link to={'/admin_login'} className="nav-link">Admin Login</Link>
              </li>
              <li className={this.state.isLoggedIn
                  ? 'nav-item'
                  : 'hidden'}>
                <Link to={'/admin_manage'} className="nav-link">Approve/Reject Airlines </Link>
              </li>
              <li className={this.state.isLoggedIn
                  ? this.state.userType == "admin"
                    ? 'nav-item'
                    : 'hidden'
                  : 'hidden'}>
                <Link to={'/admin'} className="nav-link">Admin
                </Link>
              </li>
              <li className={this.state.isLoggedIn
                  ? 'nav-item'
                  : 'hidden'}>
                <Link to={'/admin_logout'} className="nav-link">Admin Logout</Link>
              </li>
            </ul>
          </div>
        </nav>
        <br/>
        <Switch>
          <Route path='/admin_login' component={AdminLogin}/>
          <Route path='/admin_logout' component={AdminLogout}/>
          <Route path='/admin_manage' component={AdminManagementComponent}/>
          <Route path='/airline_register' component={AirlineRegisterComponent}/>
        <Route path='/airline_login' component={AirlineLoginComponent}/>
        <Route path="/" exact component={TodosList} />
        </Switch>
      </div>
    </Router>)
  }
}
export default App;
