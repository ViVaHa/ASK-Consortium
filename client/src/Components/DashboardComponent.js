import React, { Component } from 'react';
import axios from 'axios';
import {DropdownButton, Dropdown, Button, Modal} from 'react-bootstrap';


export default class CustomerList extends Component {
    
    
    constructor(props){
        super(props);
        this.state= {
           airline_name:"Jet Blue",
           requests:[],
        
        }
        this.verify=this.verify.bind(this);
        this.approve = this.approve.bind(this);
    }
        componentDidMount(){
            var listLink = "/notifications/airlines/dashboard" ;
            axios.get(listLink, {params : {"airline" : this.state.airline_name}})
            .then(response =>{            
                this.setState({requests:response.data});   
                console.log(this.state.requests);        
            })
            .catch(function(error){
                console.log(error);
            })
        }

        verify(r,event){
            this.setState({verified:false})
            axios.get("flight/checkAvailability", 
            {params : {"airline_name" : this.state.airline_name, 
            from: r.from , to: r.to}})
            .then(response =>{
                
                console.log(response);
                
            })
            .catch(function(error){
                console.log(error);
            })
            this.setState({ show: true });
        }

        approve(){

        }
    
    

    render() {
        let requests = this.state.requests;
        let row = requests.map((request)=>
        <tr>
                <td>{request.from_airline_name}</td>
                <td>{request.from}</td>
                <td>{request.to}</td>
                <td><Button variant="info"  onClick={this.verify.bind(this, request)}>Verify</Button></td>
                
                <td ><Button variant="danger" onClick={this.approve.bind(this, request) }   >Approve</Button></td>
        </tr>
        );
        return(
            <div className=" jumbotron text-center">
            <h1 >Dashboard</h1>
            <p> View the pending requests</p>
            

           
            <table className= "table table-light table-striped table-hover " style={{marginTop:20}}>
                <thead className="thead-dark">
                    <tr>
                    <th scope="col">Airline</th>
                    <th scope="col">from</th>
                    <th scope="col">to</th>
                    <th scope="col" >Verify</th>
                    <th scope="col">Approve</th>
                    </tr>
                </thead>
                <tbody>
                        {row}
                </tbody>
                </table>
           
        </div>
        )
    }

}