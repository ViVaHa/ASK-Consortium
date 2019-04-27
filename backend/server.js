const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
var cors = require('cors');
const mongoose = require('mongoose');
const db = require('../keys').mongoURI;
const session = require('./routes/session');
//console.log(db);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/session", session);
app.listen(port, () => console.log(`Listening on port ${port}`));
mongoose.connect(db, {useNewUrlParser:true}).then(
  () => {console.log("Connected to MongoDB")},
  err => {console.error("Cannot connect to MongoDB")}
);
