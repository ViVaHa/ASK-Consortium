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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/airline", airline);
app.use("/api/flight", flight);
app.use("/session", session);
app.use("/api/ticket", ticket);
app.use("/api/changeFlights", requestTracker);
app.listen(port, () => console.log(`Listening on port ${port}`));


mongoose.connect(db, {useNewUrlParser:true}).then(
  () => {console.log("Connected to MongoDB")},
  err => {console.error("Cannot connect to MongoDB")}
);
