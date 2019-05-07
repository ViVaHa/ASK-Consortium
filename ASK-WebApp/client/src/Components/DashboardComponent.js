import React, { Component } from 'react';
import axios from 'axios';
import {DropdownButton, Dropdown, Button, Modal} from 'react-bootstrap';
import AlertModal from './AlertModalComponent'
import data from '../loadBlockChainData';
export default class Dashboard extends Component {

    constructor(props){
        super(props);
        var current = this;
        this.state= {
           airline_name:localStorage.getItem('airline'),
           requests:[],
           showModal : false

        }
        console.log(this.state);
        this.verify=this.verify.bind(this);
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
            this.loadData();
        }
        async loadData(){
          this.data = await data;
          this.consortiumInstance = this.data.contract;
          this.web3 = this.data.web3;
          this.account = await this.web3.eth.getAccounts();

        }

        verify(r,event){
            var current = this;
            this.setState({verified:false})
            axios.get("flight/checkAvailability",
            {params : {"flight_name" : r.to_flight_name,
            from: r.from , to: r.to, airline_name:localStorage.getItem('airline')}})
            .then(response =>{
                if(response.status===200){
                  console.log("SEAT AVALIBILITY CHECKED");
                  axios.get("changeFlights/airlineMapping/", {params:{"airline": r.from_airline_name}})
                  .then((response)=>{
                    console.log(response);
                    r.address = response.data.address;
                    this.recordResponse(r, "accepted");
                  })
                  .catch((err)=>{
                    console.log(err);
                  })
                }
            })
            .catch(function(error){
                current.recordResponse(r,"rejected");
                current.updateRequest(r, "rejected");
                current.setState({modalText:"Not enough Seats Available", modalHeading:"Rejected"})
                current.reject(r);
                console.log(error);
            })
            this.setState({ show: true });
        }
        reject = ()=>{
            this.setState({showModal:true});
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
              this.updateRequest(r, "completed");
            })
          })
        }
        updateRequest(r, status){
          var current = this;
          let nestedObj={}
            nestedObj.customer_name = r.customer_name;
            nestedObj.from_flight_name = r.from_flight_name;
            nestedObj.to_flight_name = r.to_flight_name;
            nestedObj.from_airline_name = r.from_airline_name;
            nestedObj.to_airline_name = r.to_airline_name;
            nestedObj.status=status
            axios.put("changeFlights/update", nestedObj)
            .then((response)=>{
              console.log("RESPONSE SENT");
              console.log(response);
              //this.props.history.push('/dashboard');
              //window.location.reload();
              if(status=="completed"){
                let obj = {};
                obj.flight_name = r.to_flight_name;
                obj.airline_name = r.to_airline_name;
                axios.get('flight/getPrice', {params : {flight_name : r.to_flight_name,
                airline_name:r.to_airline_name}})
                .then((price)=>{
                  console.log(price);
                  let nestedObj = {};
                  nestedObj.amount = price.data;
                  nestedObj.lender = r.to_airline_name;
                  nestedObj.borrower = r.from_airline_name;
                  axios.put('balancesTracker/updateBalances', nestedObj)
                  .then((response)=>{
                    console.log(response);

                    //current.setState({modalText:"Seat Changed successfully", modalHeading: "Success",showModal:true});
                  })
                  .catch((err)=>{
                    console.log(err);
                  })
                })
                .catch((err)=>{
                  console.log(err);
                })

              }
            })
            .catch((err)=>{
              console.log(err);
            })
        }

        async recordResponse(r, status){
          this.account = await this.web3.eth.getAccounts();
          var acct = String(this.account);
          console.log(this.web3);
          console.log(r.address);
          var stringToHash = this.state.airline_name.concat(this.state.selectedFlight);

          stringToHash = stringToHash.concat(this.state.selectedCustomer);
          //stringToHash = stringToHash.concat(flight.airline_name);
          //stringToHash = stringToHash.concat(this.state.flightDetails.from);
          //stringToHash = stringToHash.concat(flight.name);
          let shaHash = this.web3.utils.stringToHex(stringToHash);
          shaHash = this.web3.utils.fromAscii(stringToHash).padEnd(66, '0');
          console.log(shaHash);
          this.consortiumInstance.methods.recordResponses(r.address, shaHash).send({from: acct})
          .on('transactionHash', (hash) => {
            console.log(hash);
          })
          .on('error',(err)=>{
            alert(err);
          })
          this.consortiumInstance.events.ResponseRecorded({filter: {fromBlock:'latest'}}, (error, event) => {
            //console.log(this.hash);
            if(event && event.blockHash!=this.hash){
              this.hash = event.blockHash;
              console.log(event);
              if("accepted".localeCompare(status)==0){
                console.log("Recorded success in Blockchain");
                this.updateTicket(r);

              }else{
                console.log("Recorded reject in Blockchain");
                this.updateRequest(r, "rejected");
              }

              this.setState({ isRequested: true });
            }
          })
        }

        rejectRequest(request, event){
            this.setState({modalText:"Rejecting request"})
            axios.get("changeFlights/airlineMapping/", {params:{"airline": request.from_airline_name}})
            .then((response)=>{
              console.log(response);
              request.address = response.data.address;
              this.recordResponse(request, "rejected");
            })
            .catch((err)=>{
              console.log(err);
            })

            this.setState({showModal:true, modalHeading:"Rejected"});
        }

    alertClose = e =>{
      this.setState({showAlertModal : false});
      this.props.history.push('/dashboard');
      window.location.reload();
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

            <td ><Button variant="danger" onClick={this.rejectRequest.bind(this, request) }>Reject</Button></td>
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
                  <th scope="col" >Verify and Respond</th>
                  <th scope="col">Reject</th>
                    </tr>
                </thead>
                <tbody>
                        {row}
                </tbody>
                </table>
                <AlertModal
                    show = {this.state.showModal}
                    close = {this.alertClose}
                    heading = {this.state.modalHeading}
                    body = {this.state.modalText}
                    text = "Close"/>

        </div>
        )
    }

}
