// app.js
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var http = require('http');
var mongoose = require('mongoose');
var config = require('./configs/config.js');
var profile = require('./routes/profile.js');
var specials = require('./routes/specials.js');
var offers = require('./routes/offers.js');

mongoose.connect(config.mongodb);
console.log("Successfully connected to " + config.mongodb);



app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', "*");
	res.header('Access-Control-Allow-Methods', 'GET,OPTIONS,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, access-token');
	next();
});

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || config.serverPort;

app.use('/community/profile', profile);
app.use('/community/specials', specials);
app.use('/community/offers', offers);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Listening on port ' + port);