import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import TodosList from './Components/CustomerList';

function App() {
  return (
    <Router>
        <div className="">
          <Route path="/" exact component={TodosList} />
        </div>
        
        
    </Router>
  );
}

export default App;
