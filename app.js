// app.js
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var http = require('http');
var mongoose = require('mongoose');
var config = require('./configs/config.js');
var profile = require('./routes/profile.js');
var specials = require('./routes/specials.js');

mongoose.connect(config.mongodb);
console.log("Successfully connected to " + config.mongodb);

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req,res,next){
	res.header('Access-Control-Allow-Origin',"*");
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers','Content-Type');
	next();
});

var port = process.env.PORT || config.serverPort;

app.use('/community/profile', profile);
app.use('/community/specials', specials);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Listening on port ' + port);