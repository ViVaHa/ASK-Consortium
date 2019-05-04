import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
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
