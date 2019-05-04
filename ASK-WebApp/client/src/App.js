import React from 'react';
import logo from './logo.svg';
import "bootstrap/dist/css/bootstrap.min.css";
import CustomerList from './Components/CustomerList';
import Dashboard from './Components/DashboardComponent'
import TodosList from './Components/CustomerList';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminLogin from './Components/AdminLogin'
import AdminLogout from './Components/AdminLogout'
import AdminManagementComponent from './Components/AdminManagementComponent'
import AirlineRegisterComponent from './Components/AirlineRegisterComponent'
import AirlineLoginComponent from './Components/AirlineLoginComponent'
import AirlineLogoutComponent from './Components/AirlineLogoutComponent'
import BalancesComponent from './Components/BalancesComponent'
import Web3 from 'web3';
import myData from './CounterDetails.json';
import data from './loadBlockChainData'
//import CounterJSON from './Counter.json'
const TruffleContract = require("truffle-contract");

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      isLoggedIn:false,
      isAgentLoggedIn:false
    }

  }
  componentDidMount(){

    console.log(localStorage.getItem('admin'));
    let adminLoggedIn = localStorage.getItem('admin');
    let agentLoggedIn = localStorage.getItem('agent');
    if(adminLoggedIn){
      this.setState({isLoggedIn:true});
      console.log(localStorage.getItem('admin'));
    }else{
      this.setState({isLoggedIn:false});
    }
    if(agentLoggedIn){
      this.setState({isAgentLoggedIn:true});
      console.log(localStorage.getItem('agent'));
    }else{
      this.setState({isAgentLoggedIn:false});
    }
    //this.setState({isLoggedIn:true});
    //console.log(this.state);
    //
    //
    //
    this.ABI = myData.abi;
    this.ADDRESS = myData.address;
    console.log(this.ABI);
    console.log(this.ADDRESS);

    this.loadData();
  }
  async loadData(){
      /*
      this.data = await data;

      var counter = this.data.contract;
      var web3 = this.data.web3;
      console.log(counter);
      console.log(web3);
      const accounts = await web3.eth.getAccounts();
      web3.eth.getAccounts().then(function(result){
        console.log(result);
      })
      var account = web3.eth.accounts._defaultAccount;
      var acct = String(accounts);
      counter.methods.increment(1).send({from: acct})
      .on('transactionHash', (hash) => {
        console.log(hash);
      })

        counter.events.Incremented({
            filter: {}, // Using an array means OR: e.g. 20 or 23
        }, (error, event) => {
          console.log("Triggered");
          console.log(event); })
        .on('data', (event) => {
            console.log("DATA");
            console.log(event); // same results as the optional callback above
        })
        .on('changed', (event) => {
            // remove event from local database
            console.log("Changed");
        })
        .on('error', console.error);
        */

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
              <li className={this.state.isAgentLoggedIn || this.state.isLoggedIn
                  ? 'hidden'
                  : 'nav-item'}>
                <Link to={'/airline_register'} className="nav-link">Airline Register</Link>
              </li>
              <li className={this.state.isAgentLoggedIn || this.state.isLoggedIn
                  ? 'hidden'
                  : 'nav-item'}>
                <Link to={'/airline_login'} className="nav-link">Airline Login</Link>
              </li>
              <li className={!this.state.isLoggedIn && !this.state.isAgentLoggedIn ? 'nav-item': 'hidden'}>
                <Link to={'/admin_login'} className="nav-link">Admin Login</Link>
              </li>
              <li className={this.state.isLoggedIn
                  ? 'nav-item'
                  : 'hidden'}>
                <Link to={'/admin_manage'} className="nav-link">Remove Airlines </Link>
              </li>
              <li className={this.state.isAgentLoggedIn
                  ? 'nav-item'
                  : 'hidden'}>
                <Link to={'/dashboard'} className="nav-link">Manage Requests</Link>
              </li>
              <li className={this.state.isAgentLoggedIn
                  ? 'nav-item'
                  : 'hidden'}>
                <Link to={'/balances'} className="nav-link">Settle Payments</Link>
              </li>
              <li className={this.state.isLoggedIn
                  ? this.state.userType == "admin"
                    ? 'nav-item'
                    : 'hidden'
                  : 'hidden'}>
              </li>
              <li className={this.state.isAgentLoggedIn
                  ? 'nav-item'
                  : 'hidden'}>
                <Link to={'/airline_list'} className="nav-link">Customer List</Link>
              </li>
              <li className={this.state.isLoggedIn
                  ? 'nav-item'
                  : 'hidden'}>
                <Link to={'/admin_logout'} className="nav-link">Admin Logout</Link>
              </li>
              <li className={this.state.isAgentLoggedIn
                  ? 'nav-item'
                  : 'hidden'}>
                <Link to={'/airline_logout'} className="nav-link">Airline Logout</Link>
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
          <Route path='/airline_logout' component={AirlineLogoutComponent}/>
          <Route path="/airline_list" component={TodosList} />
          <Route path="/dashboard" component={Dashboard} />
        <Route path="/balances" component={BalancesComponent} />
        </Switch>
      </div>
    </Router>)
  }
}
export default App;
