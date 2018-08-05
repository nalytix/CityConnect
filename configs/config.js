// config.js
//


// Server Details
var serverName = "CityConnect1";
var serverPort = 3000;

// Message Database Details
var mongoConnectURI = "mongodb://localhost/cityconnect";

// Location Service
var locationServiceBaseURL = 'https://maps.googleapis.com/maps/api/geocode/json?';
var locationServiceAPIKey = 'AIzaSyDfGwmg9KlUFlof4ueVwZIEP9fTPQKcNT4';
var locationServiceFormatString = 'format=json';

module.exports = {
	serverName: serverName,
	serverPort: serverPort,
	mongodb: mongoConnectURI,
	locationServiceBaseURL: locationServiceBaseURL,
	locationServiceAPIKey: locationServiceAPIKey,
	locationServiceFormatString, locationServiceFormatString
};