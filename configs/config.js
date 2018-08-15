// config.js
//


// Server Details
var serverName = "CityConnect1";
var serverPort = 3003;

// Community Database Details
var mongoConnectURI = "mongodb://localhost/cityconnect";

// Location Service
var locationServiceBaseURL = 'https://maps.googleapis.com/maps/api/geocode/json?';
var locationServiceAPIKey = 'AIzaSyDfGwmg9KlUFlof4ueVwZIEP9fTPQKcNT4';
var locationServiceFormatString = 'format=json';
var proximityInMiles = 5;

// Messages
fixedWelcomeMessage = "Welcome! You are in or near";
fixedFactMessage = "Did you know?";

module.exports = {
	serverName: serverName,
	serverPort: serverPort,
	mongodb: mongoConnectURI,
	locationServiceBaseURL: locationServiceBaseURL,
	locationServiceAPIKey: locationServiceAPIKey,
	locationServiceFormatString: locationServiceFormatString,
	proximityInMiles: proximityInMiles,
	fixedWelcomeMessage: fixedWelcomeMessage,
	fixedFactMessage: fixedFactMessage
};