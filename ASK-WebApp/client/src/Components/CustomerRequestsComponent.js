import React, { Component } from 'react';
import axios from 'axios';
import {DropdownButton, Dropdown, Button, Modal} from 'react-bootstrap';
import data from '../loadBlockChainData';
import '../App.css';


export default class CustomerRequestsComponent extends Component {


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

            flightDetails:[],
            alternateFlights:[],

            selectedAirline:"",
            from_flight_name:"",
            isRequested:false
        };
        this.handleClose = this.handleClose.bind(this);
         this.getCustomerRequests = this.getCustomerRequests.bind(this);
         this.getAlternateFlight = this.getAlternateFlight.bind(this);
         this.sendRequest = this.sendRequest.bind(this);
         this.storeRequestInDB = this.storeRequestInDB.bind(this);


    }

    componentDidMount(){
        //var listLink = "http://localhost:5000/api/products/list/" + localStorage.getItem('login');
        this.getCustomerRequests();
        this.loadData();

    }
    async loadData(){
      this.data = await data;
      this.consortiumInstance = this.data.contract;
      this.web3 = this.data.web3;
      this.account = await this.web3.eth.getAccounts();
      console.log(this.account);

    }
    getCustomerRequests(){
        var listLink = "customerRequests/getCustomerRequests/" ;
        axios.get(listLink, {params : {"airline" : this.state.airline_name}})
        .then(response =>{
            console.log(response);
            this.setState({customers:response.data});
            this.setState({showCustomers:true});
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
      from: this.state.from , to: this.state.to}})
      .then(response =>{
        console.log(response);
          console.log(response.data[0]);
          var final = response.data[0] ;
          for(var i =  1; i <response.data.length; i ++)
             final = final.concat(response.data[i]);
          this.setState({alternateFlights: final})

      })
      .catch(function(error){
          console.log(error);
      })
      this.setState({ show: true });
      }


      sendRequest(flight,e){
        console.log(this.state.airline_name, this.state.selectedFlight, this.state.selectedCustomer,flight.airline_name)
        axios.get("changeFlights/airlineMapping/", {params:{"airline": flight.airline_name}})
        .then((response)=>{
          console.log(response);
          flight.address = response.data.address;
          this.storeRequestInDB(flight,e);
        })
        .catch((err)=>{
          console.log(err);
        })


      }
      async storeRequestinBC(flight, e){

        this.account = await this.web3.eth.getAccounts();
        var acct = String(this.account);
        console.log(this.web3);
        var stringToHash = this.state.airline_name.concat(this.state.selectedFlight);
        //stringToHash = stringToHash.concat(this.state.selectedCustomer);
        //stringToHash = stringToHash.concat(flight.airline_name);
        //stringToHash = stringToHash.concat(this.state.flightDetails.from);
        //stringToHash = stringToHash.concat(flight.name);
        let shaHash = this.web3.utils.stringToHex(stringToHash);
        shaHash = this.web3.utils.fromAscii(stringToHash).padEnd(66, '0');
        console.log(shaHash);
        this.consortiumInstance.methods.recordRequests(flight.address, shaHash).send({from: acct})
        .on('transactionHash', (hash) => {
          console.log(hash);
        })
        .on('error',(err)=>{
          alert(err);
        })
        this.consortiumInstance.events.RequestRecorded({filter: {fromBlock:'latest'}}, (error, event) => {
          //console.log(this.hash);
          if(event && event.blockHash!=this.hash){
            this.hash = event.blockHash;
            console.log(event);
            this.setState({ isRequested: true });
            this.updateCustomerRequest();
          }
        })



        //this.storeRequestInDB(flight,e);

      }
      updateCustomerRequest = ()=>{
        let obj = {};
        obj.airline = this.state.airline_name;
        obj.customer_name = this.state.selectedCustomer;
        obj.status = "request_sent";
        obj.from = this.state.from;
        obj.to = this.state.to;
        axios.put("customerRequests/update/",obj)
        .then(response =>{
            console.log(response);

        })
        .catch(function(error){
            console.log(error);
        })
      }

      getFlightDetails=(flight)=>{

      }

      async storeRequestInDB(flight,e){
        axios.get('flight/info', {params : {airline_name: this.state.airline_name, flight_name:this.state.flight_name}})
        .then((details)=>{
          console.log(details);
          axios.post("changeFlights/add/",
           {from_airline_name : this.state.airline_name, from_flight_name: this.state.selectedFlight ,
              customer_name: this.state.selectedCustomer, to_airline_name:flight.airline_name,
              from:details.data.from, to:details.data.to, status:"request_sent", to_flight_name:flight.name})
          .then(response =>{
              console.log(response);
              this.storeRequestinBC(flight,e);

          })
          .catch(function(error){
              console.log(error);
              alert('Requested Already');
          })
        })
        .catch((err)=>{
          console.log(err);
        })

      }

      extractDetails(customer,e){
        this.setState({to:customer.to});
        //this.setState({selectedCustomer:customer.customer_name , from:customer.from, to:customer.to});
        this.setState({from :customer.from, selectedCustomer:customer.customer_name, to: customer.to, flight_name:customer.flight_name }, () => {
          this.getAlternateFlight();
        });
        //console.log(this.state);
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
              <td><Button variant="danger" onClick={this.extractDetails.bind(this,customer)} >Change flight</Button></td>
        </tr>
        );
        let alternateFlights = this.state.alternateFlights;
        let flightRow = alternateFlights.map((flight)=>
            <tr >
                <td>{flight.name}</td>
                <td>{flight.airline_name}</td>
              <td>{flight.price} ethers</td>
                <td>
                <Button variant="dark" onClick={this.sendRequest.bind(this, flight)} >Change flight</Button>
                </td>
            </tr>
        );
        return (

            <div >
            <div className="jumbotron text-center">
                <h1 >{this.state.airline_name}</h1>
              <p> Customer Requests</p>
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
                    <th scope="col">Price </th>
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
