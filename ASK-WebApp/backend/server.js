const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
var cors = require('cors');
const mongoose = require('mongoose');
const db = require('../keys').mongoURI;
const airline = require("./routes/airlineRoutes");
const flight = require("./routes/flightRoutes");
const session = require('./routes/session');
const ticket = require("./routes/ticketRoutes");
const requestTracker = require("./routes/requestTrackerRoutes");
const notifications = require('./routes/notifications');
const admin = require('./routes/admin');
const balancesTracker = require('./routes/balancesTracker');
const database = require('./DBConnections').database;
const accounts = require('./functions/loadBlockChain')
const customerRequests = require('./routes/customerRequests');
const fs= require('fs');
const path = require('path');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/airline", airline);
app.use("/flight", flight);
app.use("/session", session);
app.use("/ticket", ticket);
app.use("/changeFlights", requestTracker);
app.use("/notifications", notifications);
app.use("/admin", admin);
app.use('/balancesTracker', balancesTracker);
app.use('/customerRequests',customerRequests);
app.listen(port, () => console.log(`Listening on port ${port}`));




//console.log(obj)
let source = fs.readFileSync(path.join(__dirname, '../../ASK-contract/build/contracts/Consortium.json'));
let abi = JSON.parse(source)["abi"];
let json =JSON.parse(source);
let address = json.networks["5777"].address
let obj={};
obj.abi = abi;
obj.address = address;
fs.writeFile('../client/src/Consortium.json', JSON.stringify(obj, null, 2), 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
    console.log("JSON file has been saved.");
})



// mongoose.connect(db, {useNewUrlParser:true}).then(
//   () => {console.log("Connected to MongoDB")},
//   err => {console.error("Cannot connect to MongoDB")}
// );
// mongoose.set('useFindAndModify', false);
//
//
// process.on('SIGINT', function(){
//     mongoose.connection.close(function(){
//       console.log("Mongoose default connection is disconnected due to application termination");
//        process.exit(0);
//       });
// });
