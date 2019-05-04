import React, { Component } from 'react';
import axios from 'axios';
import {DropdownButton, Dropdown, Button, Modal} from 'react-bootstrap';


import '../App.css';



export default class CustomerList extends Component {


    constructor(props){
        super(props);
        this.state= {
            customers:[],
            limit :5,
            airline_name:localStorage.getItem('airline'),
            flights:[],
            chosen:"",
            selectedFlight:"Select Flight",
            showCustomers:false,
            show:false,
            from:"",
            to:"",
            flightDetails:[],
            alternateFlights:[],
            selectedCustomer:"",
            selectedAirline:"",
            from_flight_name:"",
            isRequested:false
        };
        this.handleClose = this.handleClose.bind(this);
         this.getCustomers = this.getCustomers.bind(this);
         this.getAlternateFlight = this.getAlternateFlight.bind(this);
         this.sendRequest = this.sendRequest.bind(this);


    }

    componentDidMount(){
        //var listLink = "http://localhost:5000/api/products/list/" + localStorage.getItem('login');

        var listLink = "ticket/flights/" ;
        axios.get(listLink, {params : {"airline_name" : this.state.airline_name}})
        .then(response =>{
            this.setState({flights:response.data});


        })
        .catch(function(error){
            console.log(error);
        })
    }

    getCustomers(){
        var listLink = "ticket/customers/" ;
        axios.get(listLink, {params : {"airline_name" : this.state.airline_name, flight_name: this.state.selectedFlight}})
        .then(response =>{

            this.setState({customers:response.data});
            this.setState({showCustomers:true});

            axios.get("flight/info", {params : {"airline_name" : this.state.airline_name, flight_name: this.state.selectedFlight}})
            .then(response =>{

                this.setState({flightDetails:response.data});


            })
            .catch(function(error){
                console.log(error);
            })
        })
        .catch(function(error){
            console.log(error);
        })

    }




    handleClose() {
        this.setState({ show: false , isRequested:false});
      }



    getAlternateFlight() {
        console.log(this.state);
        axios.get("flight/alternateFlight/",
        {params : {"airline_name" : this.state.airline_name,
        from: this.state.flightDetails.from , to: this.state.flightDetails.to}})
        .then(response =>{

            this.setState({alternateFlights:response.data})

        })
        .catch(function(error){
            console.log(error);
        })
        this.setState({ show: true });
      }


      sendRequest(flight,e){
        console.log(flight);
        console.log(this.state.airline_name, this.state.selectedFlight, this.state.selectedCustomer,flight.name)
        axios.post("changeFlights/add/",
         {from_airline_name : this.state.airline_name, from_flight_name: this.state.selectedFlight ,
            customer_name: this.state.selectedCustomer, to_airline_name:flight.airline_name,
            from:this.state.flightDetails.from, to:this.state.flightDetails.to, status:"request_sent", to_flight_name:flight.name})
        .then(response =>{
            console.log(response)
            this.setState({ isRequested: true });
        })
        .catch(function(error){
            console.log(error);
            alert('Requested Already');
        })


      }
      async storeRequest(){

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
                <td><Button variant="danger" onClick={e => {this.setState({ selectedCustomer:customer.customer_name})
            this.getAlternateFlight()}} >Change flight</Button></td>
        </tr>
        );
        let alternateFlights = this.state.alternateFlights;
        let flightRow = alternateFlights.map((flight)=>
            <tr >
                <td>{flight.name}</td>
                <td>{flight.airline_name}</td>
                <td>
                <Button variant="dark" onClick={this.sendRequest.bind(this, flight)} >Change flight</Button>
                </td>
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



        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Select Flight</Modal.Title>
          </Modal.Header>
          <Modal.Body>
                <table className= "table table-light table-striped table-hover " style={{marginTop:20}}>
                <thead className="thead-dark">
                    <tr>
                    <th scope="col">flight name</th>
                    <th scope="col">Airline </th>
                    <th scope="col">choose </th>
                    </tr>
                </thead>
                <tbody>
                        {flightRow}
                </tbody>
                </table>
                <div className={this.state.isRequested==true? '': 'hidden'}> Requested Airline</div>
          </Modal.Body>
          <Modal.Footer>

            <Button variant="danger" onClick={this.handleClose}>
              close
            </Button>
          </Modal.Footer>
        </Modal>
            </div>
        )
    }
}
