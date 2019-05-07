import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import data from '../loadBlockChainData';
var web3;
var consortiumInstance;
const Airline = props=>(
    <tr>
        <td className = {props.airline.status=="dismissed" ? 'hidden' : ' ' }>{props.airline.airline}</td>
      <td className = {props.airline.status=="approved" ? 'showDelete' : 'hidden' } >
        <DeleteButton airline={props.airline}/>
        </td>
        <td className = {props.airline.status==="pending" ? 'showApprove' : 'hidden' } >
          <ApproveButton airline={props.airline}/>
          </td>
    </tr>
)

class DeleteButton extends Component{
  constructor(props){
      super(props);
      this.state = {
          airline : this.props.airline.airline,
          status : this.props.airline.status,
          action : 'dismissed'
      }
  }
deleteAirline = e =>{
  this.unregister();
  //console.log(e.target);

}
async unregister(){
  console.log(consortiumInstance.methods);
  let account = await web3.eth.getAccounts();
  var acct = String(account);
  axios.get("changeFlights/airlineMapping/", {params:{"airline": this.state.airline}})
  .then((response)=>{
    console.log(response);
    let address = response.data.address;
    consortiumInstance.methods.unregisterAirline(address).send({from: acct})
    .on('transactionHash', (hash) => {
      console.log(hash);
    })
    .on('error',(err)=>{
      alert(err);
    })
    this.hash = null;
    consortiumInstance.events.Unregistered({filter: {fromBlock:'latest'}}, (error, event) => {
      console.log(this.hash);
      if(event && event.blockHash!=this.hash){
        this.hash = event.blockHash;
        axios.put("http://localhost:5000/admin/update/", this.state)
        .then(response => {
          console.log(response);
          //window.location.reload();
        })
        .then(()=>{
          this.deleteEverything();
        })
        .catch(error =>{
          console.log(error);
        })
      }

    })
  })
  .catch((err)=>{
    console.log(err);
  })
}

deleteEverything=()=>{
  console.log(this.state.airline);
  let obj={};
  obj.airline = this.state.airline;
  axios.post('changeFlights/delete', obj)
  .then((res)=>{
    axios.post('session/deleteMapping', obj)
    .then((res)=>{
      console.log(res);
      console.log("Mapping deleted");
      axios.post('session/agentRemoval', obj).
      then((res)=>{
        console.log("Agents deleted");
        alert("Removed"+ this.state.airline +"from Consortium");
        window.location.reload();
      })
    })
    .catch((err)=>{
      console.log(err);
    })
  })
  .catch((err)=>{
    console.log(err);
  })


}

  render() {
      return (
        <button onClick={this.deleteAirline} value={this.state.airline} type="button" className="btn btn-danger">
          Dismiss Airline
        </button>
      );
  }


}

class ApproveButton extends Component{
    constructor(props){
        super(props);

        this.state = {
            airline : this.props.airline.airline,
            status : this.props.airline.status,
            action : 'approved'
        }
    }
approveUser = e =>{
  console.log(e.target);
    axios.put("http://localhost:5000/admin/update/", this.state)
    .then(response => {
      window.location.reload();
    })
    .catch(error =>{
      console.log(error);
    })
}

    render() {
        return (
          <button onClick={this.approveUser} value={this.state.airline} type="button" className="btn btn-success">
            Approve Airline
          </button>
        );
    }

}









export default class AdminManagementComponent extends Component{
    constructor(props){
        super(props);
        this.onLoadMore = this.onLoadMore.bind(this);
        this.airlinesList = this.airlinesList.bind(this);

        this.state= {
            airlines:[],
            limit :5

        };
    }


    componentDidMount(){
        var listLink = "http://localhost:5000/admin/list";
        axios.get(listLink)
        .then(response =>{
            this.setState({airlines:response.data});
        })
        .catch(function(error){
            console.log(error);
        })
        this.loadData();
    }

    async loadData(){
      this.data = await data;
      consortiumInstance = this.data.contract;
      web3 = this.data.web3;
      //this.account = await this.web3.eth.getAccounts();
    }


    onLoadMore() {
        this.setState({
            limit: this.state.limit + 5
        });

    }


    airlinesList(){
        return this.state.airlines.slice(0,this.state.limit).map(function(airline,i){
            return(
              <Airline airline={airline} key={i}/>
            )
        });
    }
    render(){
        return (

            <div>
            <h3>Airlines</h3>
            <table className= "table table-light table-striped table-hover " style={{marginTop:20}}>
            <thead className="thead-dark">
                <tr>
                <th scope="col">Airline</th>
                <th scope="col">Actions</th>
                </tr>
            </thead>
                <tbody>
                    {this.airlinesList()}
                </tbody>

            </table>
            <a href="#" onClick={this.onLoadMore}>Load</a>
            </div>

        )
    }
}
