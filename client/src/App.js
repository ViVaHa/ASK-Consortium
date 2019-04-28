import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import CustomerList from './Components/CustomerList';
import Dashboard from './Components/DashboardComponent'

function App() {
  return (
    <Router>
        <div className="">
          <Route path="/" exact component={CustomerList} />
          <Route path="/dashboard" exact component={Dashboard} />
        </div>
        
        
    </Router>
  );
}

export default App;
