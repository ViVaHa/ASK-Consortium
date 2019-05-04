const fs = require("fs");
const path = require('path');
const Web3 = require('web3');

const url =  'http://127.0.0.1:7545';
var web3Provider;
web3Provider = new Web3.providers.HttpProvider(url);
//console.log(web3Provider);
web3 = new Web3(web3Provider)
//ethereum.enable();



// "Web3.providers.givenProvider" will be set if in an Ethereum supported browser.
//const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


// var ether_port = 'ws://localhost:7545'
// var web3       = new Web3(new Web3.providers.WebsocketProvider(ether_port));
//
//
//
// let source = fs.readFileSync(path.join(__dirname, '../../../ASK-contract/build/contracts/Counter.json'));
// let abi = JSON.parse(source)["abi"];
// let json =JSON.parse(source);
// let address = json.networks["5777"].address
//
//
//
//
// const Counter = new web3.eth.Contract(abi, address);
// // Counter.methods.increment(1).send({from: '0x36F225885c0dacB1b5BeB2D1AeF79f440A969C10'}, (err,res)=>{
// //   if(err){
// //     console.log(err);
// //   }else{
// //     console.log(res);
// //   }
// // })
//
//
//
//
// Counter.methods.increment(1).send({from: '0x36F225885c0dacB1b5BeB2D1AeF79f440A969C10'})
// .on('transactionHash', (hash) => {
//     console.log(hash);
// })
// .on('confirmation', (confirmationNumber, receipt) => {
//     console.log("nhfhfh");
// })
// .on('receipt', (receipt) => {
//   console.log(receipt);
// })
// .on('error',(error)=>{
//   console.log(error);
// })
//
//
//
//
// // Counter.once('Incremented', {},(err,res)=>{
// //   if(res){
// //     console.log(res);
// //   }else{
// //     console.log(err);
// //   }
// // })
//
//
// // Counter.events.Incremented({ fromBlock:'latest' }, function(error, result) {
// //     if(result){
// //       console.log(result.returnValues.x._hex);
// //     }else{
// //       console.log(err);
// //     }
// // })
// // .on('data', (event) => {
// //     console.log(event); // same results as the optional callback above
// // })
//
//
//
//
//
//
//
//
// var accounts;
// web3.eth.getAccounts()
// .then((accts)=>{
//   accounts = accts;
//   //console.log(accts);
// })
//
// module.export = accounts;
