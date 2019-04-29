import React, { Component } from 'react';
import axios from 'axios';
import {DropdownButton, Dropdown, Button, Modal} from 'react-bootstrap';


export default class Dashboard extends Component {


    constructor(props){
        super(props);
        this.state= {
           airline_name:localStorage.getItem('airline'),
           requests:[],

        }
        console.log(this.state);
        this.verify=this.verify.bind(this);
        this.approve = this.approve.bind(this);
        this.updateTicket = this.updateTicket.bind(this);
        this.updateRequest = this.updateRequest.bind(this);
    }
        componentDidMount(){
            var listLink = "/notifications/airlines/dashboard" ;
            let tempRequests=[]
            axios.get(listLink, {params : {"airline" : this.state.airline_name}})
            .then(response =>{
                this.setState({requests:response.data});
                tempRequests = this.state.requests;
                for(var i=0;i<tempRequests.length;i++){
                  console.log(tempRequests[i]);
                  if("verified"===tempRequests[i].status){
                      tempRequests[i].showVerify=false;
                  }else{
                    tempRequests[i].showVerify=true;
                  }

                  tempRequests[i].showApprove=false;
                }
            })
            .then(()=>{

              this.setState({requests:tempRequests})
              console.log(this.state.requests);
            })

            .catch(function(error){
                console.log(error);
            })
        }

        verify(r,event){
            this.setState({verified:false})
            axios.get("flight/checkAvailability",
            {params : {"flight_name" : r.to_flight_name,
            from: r.from , to: r.to, airline_name:localStorage.getItem('airline')}})
            .then(response =>{
                if(response.status===200){
                  console.log("SEAT AVALIBILITY CHECKED");
                  //console.log(r);
                  this.updateTicket(r);
                  //blockchain code
                  //console.log(obj);
                }
            })
            .catch(function(error){
                console.log(error);
            })
            this.setState({ show: true });
        }

        updateTicket(r){
          let obj = {};
          obj.customer_name = r.customer_name;
          obj.old_flight_name = r.from_flight_name;
          obj.new_flight_name = r.to_flight_name;
          obj.old_airline_name = r.from_airline_name;
          obj.new_airline_name = r.to_airline_name;
          axios.put("ticket/update/", obj)
          .then((response)=>{
            if(response.status===200){
                console.log("TICKET UPDATED");
                //this.updateRequest(r);
                this.updateFlights(r);
            }
          })
          .catch((err)=>{
            console.log(err);
          })
        }

        updateFlights(r){
          let obj={}
          obj.increment = -1;
          obj.flight_name = r.to_flight_name;
          obj.airline_name = r.to_airline_name;
          axios.put("flight/update", obj)
          .then((updated_new)=>{
            console.log("DECREMENTED IN NEW AIRLINE");
            let nestedObj={}
            nestedObj.increment = 1;
            nestedObj.flight_name = r.from_flight_name;
            nestedObj.airline_name = r.from_airline_name;
            axios.put("flight/update", nestedObj)
            .then((updated_old)=>{
              console.log("INCREMENTED IN OLD AIRLINE");
              this.updateRequest(r);
            })
          })
        }
        updateRequest(r){
          let nestedObj={}
            nestedObj.customer_name = r.customer_name;
            nestedObj.from_flight_name = r.from_flight_name;
            nestedObj.to_flight_name = r.to_flight_name;
            nestedObj.from_airline_name = r.from_airline_name;
            nestedObj.to_airline_name = r.to_airline_name;
            nestedObj.status="completed"
            axios.put("changeFlights/update", nestedObj)
            .then((response)=>{
              console.log("RESPONSE SENT");
              console.log(response);
              //this.props.history.push('/dashboard');
              //window.location.reload();

            })
            .catch((err)=>{
              console.log(err);
            })
        }



        approve(){

        }



    render() {
        let requests = this.state.requests;
        let row = requests.map((request)=>
        <tr>
                <td>{request.from_airline_name}</td>
              <td>{request.to_flight_name}</td>
                <td>{request.from}</td>
                <td>{request.to}</td>
              <td><Button variant="info"  onClick={this.verify.bind(this, request)} disabled={!request.showVerify}>Verify</Button></td>

            <td ><Button variant="danger" onClick={this.approve.bind(this, request) }>Reject</Button></td>
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
                  <th scope="col">Requested Flight</th>
                    <th scope="col">from</th>
                    <th scope="col">to</th>
                  <th scope="col" >Verify and Approve</th>
                  <th scope="col">Reject</th>
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
