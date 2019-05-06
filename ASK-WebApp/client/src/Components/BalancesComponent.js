import React, { Component } from 'react';
import axios from 'axios';
import {DropdownButton, Dropdown, Button, Modal} from 'react-bootstrap';
import PromptModal from './PromptModalComponent'
import data from '../loadBlockChainData';
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
              console.log(balances);
              let details = balances.data.result;
              for(var i=0;i<details.length;i++){
                  if(details[i].amount>0){
                    myMap.set(details[i].borrower, -details[i].amount);
                  }else{
                    myMap.set(details[i].borrower, 0);
                  }
              }
              axios.get('balancesTracker/amountBorrowed', {params:{lender:this.state.airline_name}})
              .then((balances)=>{
                console.log(balances);
                let details = balances.data.result;
                for(var i=0;i<details.length;i++){
                    console.log(details[i].lender);
                    let amt = myMap.get(details[i].lender);
                    if(amt){
                      myMap.set(details[i].lender, details[i].amount+amt);
                    }else{
                      myMap.set(details[i].lender, details[i].amount);
                    }

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
            this.loadData();
        }
    async loadData(){
      this.data = await data;
      this.consortiumInstance = this.data.contract;
      this.web3 = this.data.web3;
      this.account = await this.web3.eth.getAccounts();
    }
    alertClose = e =>{
      //blockchain
      this.setState({showAlertModal : false});
      this.props.history.push('/balances');
      window.location.reload();
    }

    settlePayment(balance, event){
      this.setState({tempAirline : balance.airline_name, amount:balance.amount});
      this.setState({modalText:"Click to settle Payment"})
      this.setState({modalHeading:"Settle?",showModal:true});
    }



    settle=()=>{
      let obj={};
      axios.get("changeFlights/airlineMapping/", {params:{"airline": this.state.tempAirline}})
      .then((response)=>{
        //console.log(response);
        obj.lender = response.data.address;
        axios.get("changeFlights/airlineMapping/", {params:{"airline": this.state.airline_name}})
        .then((response)=>{
          obj.borrower = response.data.address;
          if(this.state.amount<0){
            let temp = obj.borrower;
            obj.borrower = obj.lender;
            obj.lender = temp;
            let tempAmount = -this.state.amount;
            this.setState({amount:tempAmount});
            console.log(this.state.amount);
          }
          this.setState({lender: obj.lender, borrower:obj.borrower});
          //this.settleBalances(obj);
          this.settleInBC();
        })
        .catch((err)=>{
          console.log(err);
        })
      })
      .catch((err)=>{
        console.log(err);
      })
    }
    async settleInBC(){
      this.account = await this.web3.eth.getAccounts();
      var acct = String(this.account);
      console.log(this.state);
      let amt = this.web3.utils.toWei(this.state.amount.toString())
      console.log(amt);
      this.consortiumInstance.methods.settleBalances(this.state.lender, amt).send({from: this.state.borrower})
      .on('transactionHash', (hash) => {
        console.log(hash);
      })
      .on('error',(err)=>{
        alert(err);
      })
      this.hash = null;
      this.consortiumInstance.events.Settled({filter: {fromBlock:'latest'}}, (error, event) => {
        console.log(this.hash);
        if(event && event.blockHash!=this.hash){
          this.hash = event.blockHash;
          console.log(event);
          //this.alertClose();
          this.updateDB();
        }
      })
    }
    updateDB=()=>{
      let obj={};
      obj.lender = this.state.airline_name;
      obj.borrower = this.state.tempAirline;
      obj.amount = 0;
      axios.put('balancesTracker/nullifyBalance', obj)
      .then((response)=>{
        console.log(response);
        let obj={};
        obj.borrower = this.state.airline_name;
        obj.lender = this.state.tempAirline;
        obj.amount = 0;
        axios.put('balancesTracker/nullifyBalance', obj)
        .then((response)=>{
          this.alertClose();
        });
      });
    }
    render() {
        let balances = this.state.balances;
        let row = balances.map((balance)=>
        <tr>
              <td>{balance.airline_name}</td>
            <td>{balance.amount} ethers</td>
          <td><Button variant="info"  onClick={this.settlePayment.bind(this, balance)} disabled={balance.amount<=0}>Settle</Button></td>
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
                    <th scope="col">Amount owed</th>
                  <th scope="col">Actions</th>

                    </tr>
                </thead>
                <tbody>
                        {row}
                </tbody>
                </table>
                <PromptModal
                    show = {this.state.showModal}
                    primaryaction = {this.settle}
                    heading = {this.state.modalHeading}
                    body = {this.state.modalText}
                    close = {this.alertClose}
                    primarytext = "Settle"
                    secondarytext = "Close"
                    heading = "Do you want to Settle for sure?"
                    body = "If Yes Press Settle else click the button close"/>
        </div>
        )
    }

}
