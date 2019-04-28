import React, { Component } from 'react';
import axios from 'axios';
import {DropdownButton, Dropdown, Button, ButtonToolbar} from 'react-bootstrap';

import '../App.css';
const Customer = props=>(
    <tr>
        <td>{props.customer.customer_name}</td>
        <td><Button>Change flight</Button></td>
    </tr>
)


export default class CustomerList extends Component {


    constructor(props){
        super(props);
        this.state= {
            customers:[],
            limit :5,
            airline_name:"",
            flights:[],
            chosen:"",
            selectedFlight:"Select Flight",
            showCustomers:false
        };
        this.onLoadMore = this.onLoadMore.bind(this);
        this.getCustomers = this.getCustomers.bind(this);

    }

    componentDidMount(){
        //var listLink = "http://localhost:5000/api/products/list/" + localStorage.getItem('login');
        let airline  = localStorage.getItem('airline');
        var listLink = "ticket/flights/" ;
        axios.get(listLink, {params : {"airline_name" : airline}})
        .then(response =>{
            this.setState({flights:response.data});
            //console.log(this.state.flights)
        })
        .catch(function(error){
            console.log(error);
        })
    }

    getCustomers(){
        let airline  = localStorage.getItem('airline');
        var listLink = "/ticket/customers/" ;
        axios.get(listLink, {params : {"airline_name" : airline, flight_name: this.state.selectedFlight}})
        .then(response =>{

            this.setState({customers:response.data});
            this.setState({showCustomers:true});
            //console.log(this.state.customers)
        })
        .catch(function(error){
            console.log(error);
        })
    }
    onLoadMore() {
        this.setState({
            limit: this.state.limit + 5
        });

    }








    render() {
        let flights  = this.state.flights;
        let optionItems = flights.map((flight) =>
                          <Dropdown.Item key={flight}><a onClick = {e => this.setState({ selectedFlight:flight})} >{flight}</a></Dropdown.Item>
                          );
        let customers = this.state.customers;
        let row = customers.map((customer)=>
        <tr>
                <td>{customer.customer_name}</td>
                <td><Button>Change flight</Button></td>
        </tr>
        );
        return (

            <div >
            <div className="jumbotron text-center">
                <h1 >{this.state.airline_name}</h1>
                <p> Get Customer for a flight</p>


                <div className="col-sm-6 offset-sm-5 text-center">
                <table>
                    <tr><td><DropdownButton id="dropdown-basic-button"  variant="light" title={this.state.selectedFlight}>
                                            {optionItems}
                        </DropdownButton> </td>
                        <td><Button variant="dark" onClick={this.getCustomers}>Get Customers</Button></td></tr>
                </table>
                </div>




            </div>

            <div className={this.state.showCustomers==false?'hidden':'col-sm-6 offset-sm-3 text-center' }>


                <table className= "table table-light table-striped table-hover " style={{marginTop:20}}>
                <thead className="thead-dark">
                    <tr>
                    <th scope="col">email</th>
                    <th scope="col">change</th>
                    </tr>
                </thead>
                <tbody>
                        {row}
                </tbody>
                </table>

            </div>
            </div>
        )
    }
}
