var express = require('express');
var request = require('request');
var specialsRouter = express.Router();
var db = require('../libraries/mongo');
var config = require('../configs/config');
var functions = require('../libraries/utilities');

specialsRouter.route('/add')
    .post(function(req,res){
        
        var startDate = req.body.start_date;
        var endDate = req.body.end_date;
        var name = req.body.name;
        var title = req.body.title;
        var description = req.body.description;
        var sponsor = req.body.sponsor;
        var address = req.body.address;
        var city = req.body.city;
        var region = req.body.region;
        var country = req.body.country;
        var postalCode = req.body.postal_code;
        var actions = req.body.actions;
        var messages = req.body.messages;
        var fineprint = req.body.fineprint;
        var collapsedDesc = req.body.collapsed_desc;

        // make sure that all required information is provided
        if (
            !startDate || !endDate || !name || !title || !sponsor || !collapsedDesc ||
            !address || !city || !region || !country || !postalCode || !actions || !fineprint || !messages
        ){
            res.status(404).send({"status": "error", "message": "Request missing required information", "stack": null});
            return;
        }

        // Prepare address for conversion to point
        //find coordinates automatically based on name, country and region
		var flattenedAddress = address + ' ' + city + ' ' + region + ' ' + postalCode + ' ' + country;

		var URLReadyAddress=encodeURIComponent(flattenedAddress);
		var URLReadyAddress=URLReadyAddress.replace(/%20/g,"+");
		locationServiceURI = config.locationServiceBaseURL+"address="+URLReadyAddress+"&key="+config.locationServiceAPIKey;

        request(locationServiceURI, function(err, req, body){
			
			if (!err){
				
				if (body){
                    console.log(body);
					locationServiceResp = JSON.parse(body);
					
					// coordinates are successfully retrieved, call the database service to save the community
					if (locationServiceResp.results.length > 0 ){

                        var coordinates = [parseFloat(locationServiceResp.results[0].geometry.location.lng), parseFloat(locationServiceResp.results[0].geometry.location.lat)];
                        var special = new Object({
                            name: name,
                            title: title,
                            description: description,
                            sponsor: sponsor,
                            address: address,
                            city: city,
                            region: region,
                            country: country,
                            postal_code: postalCode,
                            latlng: coordinates,
                            start_date: startDate,
                            end_date: endDate,
                            actions: actions,
                            messages: messages,
                            fineprint: fineprint,
                            collapsed_desc: collapsedDesc
                        });
						
						
						
						
						// call database service
						db.add_special(special, function(dberr, savedSpecial){
							if (dberr){
								res.status(404).send({"status": "error", "message": "Database error encountered", "stack": dberr});
							} else {
								if (savedSpecial){
									res.status(200).send({"status": "success", "data": savedSpecial});
								} else {
									res.status(404).send({"status": "error", "message": "Something went wrong when saving to database."});
								}
							}
						});
						
					} else {
						
						res.status(404).send({"status": "error", "message": "Unable to locate " + flattenedAddress + " on the map."});
						
					}
				} else {
					
					res.status(404).send({"status": "error", "message": "No response from location service when attempting to locate " + flattenedAddress + " on the map."});
					
				}
				
			} else {
				
				res.status(404).send({"status": "error", "message": "Error from location service when attempting to locate " + flattenedAddress + " on the map. : " + err});
			
			}
			
		})
    });


module.exports = specialsRouter;