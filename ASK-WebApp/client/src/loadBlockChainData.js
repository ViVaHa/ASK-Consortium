import Web3 from 'web3';
import myData from './Consortium.json';
async function loadContract(){

const web3 = new Web3(window.ethereum);
await window.ethereum.enable();
const accounts = await web3.eth.getAccounts();
//web3.eth.accounts._defaultAccount = accounts[0];
const consortiumInstance = new web3.eth.Contract(myData.abi, myData.address);
let data={
  contract:consortiumInstance,
  web3:web3
}
return data;
}

var data = loadContract();




export default data;
