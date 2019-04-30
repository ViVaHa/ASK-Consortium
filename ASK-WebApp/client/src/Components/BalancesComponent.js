import React, { Component } from 'react';
import axios from 'axios';
import {DropdownButton, Dropdown, Button, Modal} from 'react-bootstrap';
import AlertModal from './AlertModalComponent'

export default class BalancesComponent extends Component {

    constructor(props){
        super(props);
        var current = this;
        this.state= {
           airline_name:localStorage.getItem('airline'),
           balances:[],
           showModal : false

        }


    }
        componentDidMount(){
            var myMap = new Map();
            axios.get('balancesTracker/amountLent', {params:{lender:this.state.airline_name}})
            .then((balances)=>{
              let details = balances.data.result;
              for(var i=0;i<details.length;i++){
                  if(details[i].amount>0){
                    myMap.set(details[i].borrower, details[i].amount);
                  }else{
                    myMap.set(details[i].borrower, 0);
                  }
              }
              axios.get('balancesTracker/amountBorrowed', {params:{lender:this.state.airline_name}})
              .then((balances)=>{
                let details = balances.data.result;
                for(var i=0;i<details.length;i++){
                    console.log(details[i].lender);
                    let amt = myMap.get(details[i].lender);
                    if(amt)
                      myMap.set(details[i].lender, amt - details[i].amount);
                }
                let objects=[]
                for (var [key, value] of myMap) {
                  objects.push({'airline_name': key,'amount': value});
                }
                this.setState({balances:objects});
              })
              .catch((err)=>{
                console.log(err);
              })
            })
            .catch((err)=>{
              console.log(err);
            })

        }
    alertClose = e =>{
      //blockchain
      this.setState({showAlertModal : false});
      this.props.history.push('/balances');
      window.location.reload();
    }

    settlePayment(balance, event){
      console.log(balance);
      this.setState({modalText:"Click to settle Payment"})
      this.setState({modalHeading:"Settle?",showModal:true});


    }

    render() {
        let balances = this.state.balances;
        let row = balances.map((balance)=>
        <tr>
              <td>{balance.airline_name}</td>
            <td>{balance.amount} wei</td>
            <td><Button variant="info"  onClick={this.settlePayment.bind(this, balance)}>Settle</Button></td>
        </tr>
        );
        return(
            <div className=" jumbotron text-center">
            <h1 >SettlePayments</h1>
          <p> Settle All Payments here</p>



            <table className= "table table-light table-striped table-hover " style={{marginTop:20}}>
                <thead className="thead-dark">
                    <tr>
                    <th scope="col">Airline</th>
                    <th scope="col">Amount owned</th>
                  <th scope="col">Actions</th>

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
                    text = "Settle Payment"/>

        </div>
        )
    }

}
