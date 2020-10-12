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
var proximityInMiles = 40;

// Messages
var fixedWelcomeMessage = "You are connected to ";
var fixedFactMessage = "Did you know?";
var partnerRecognitionPrefix = "Brought to you by the ";


// If not near an 'nroote community
var nrooteImageUrl = "https://s3.amazonaws.com/nalytix-cityconnect/Dev/nroote1.jpg";
var nrooteWelcomeMessage = "You are not near a ";
var nrooteFactMessage = "But, did you know?";
var nrooteFacts = [
	"'nroote is part of an ecosystem of applications used to create data-driven, digitally connected local communities called 'nroote communities.",
	"Events published on 'nroote can be hosted by anyone that has an 'nroote account, any business that is part of an 'nroote community or a village, town or city that is an 'nroote community.",
	"The 'Live' tab in 'nroote has the ability provide you with promotions that are completely personalized to you, if the business chooses to.",
	"You must capture the promotion into your wallet, in the 'Live' tab, if you want to use it at a business. Promotions can change every 2 minutes. That's why there is a two minute timer on that tab",
	"The 'nroote is part of an ecosystem of applications that were developed to enable local social engagement and community growth.",
	"'nalytix, the company that developed 'nroote, partners with local communities to create data-driven, digitally connected and socially enabled communities.",
	"When you use promotions provided through 'nroote's 'Live' tab at the associated local business, you get local loyalty points which can be redeemed for gifts or donated to charity for its cash value."
];
var nrooteCityName = "'nroote community";
var danddCityName = "DrinknDine community";

module.exports = {
	serverName: serverName,
	serverPort: serverPort,
	mongodb: mongoConnectURI,
	locationServiceBaseURL: locationServiceBaseURL,
	locationServiceAPIKey: locationServiceAPIKey,
	locationServiceFormatString: locationServiceFormatString,
	proximityInMiles: proximityInMiles,
	fixedWelcomeMessage: fixedWelcomeMessage,
	fixedFactMessage: fixedFactMessage,
	nrooteImageUrl: nrooteImageUrl,
	nrooteWelcomeMessage: nrooteWelcomeMessage,
	partnerRecognitionPrefix: partnerRecognitionPrefix,
	nrooteFactMessage: nrooteFactMessage,
	nrooteFacts: nrooteFacts,
	nrooteCityName: nrooteCityName,
	danddCityName: danddCityName
};