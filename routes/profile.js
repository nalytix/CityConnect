var express = require('express');
var request = require('request');
var profileRouter = express.Router();
var db = require('../libraries/mongo');
var config = require('../configs/config');
var functions = require('../libraries/utilities');

// API to add a new community to the database
profileRouter.route('/add')
	.post(function (req, res) {

		//check for missing fields in the body
		if (!req.body.name || !req.body.country || !req.body.region || !req.body.postal_code || !req.body.type || !req.body.contacts || req.body.contacts.length == 0)
			res.status(404).send({ "status": "error", "message": "There are required fields missing" });

		// create the community object
		var community = {};
		community.name = req.body.name;
		community.display_name = req.body.display_name;
		community.dandd_display_name = req.body.dandd_display_name;
		community.partner_organization = req.body.partner_organization;
		community.country = req.body.country;
		community.region = req.body.region;
		community.postal_code = req.body.postal_code;
		community.nroote_partner = req.body.nroote_partner;
		community.dandd_partner = req.body.dandd_partner;
		community.status = "Pending";
		community.type = req.body.type;
		community.program = "live-local";
		community.contacts = req.body.contacts;

		//find coordinates automatically based on name, country and region
		var flattenedAddress = community.name + ' ' + community.region + ' ' + community.postal_code + ' ' + community.country;

		var URLReadyAddress = encodeURIComponent(flattenedAddress);
		var URLReadyAddress = URLReadyAddress.replace(/%20/g, "+");
		locationServiceURI = config.locationServiceBaseURL + "address=" + URLReadyAddress + "&key=" + config.locationServiceAPIKey;


		request(locationServiceURI, function (err, req, body) {

			if (!err) {

				if (body) {
					locationServiceResp = JSON.parse(body);

					// coordinates are successfully retrieved, call the database service to save the community
					if (locationServiceResp.results.length > 0) {

						community.latlng = [parseFloat(locationServiceResp.results[0].geometry.location.lng), parseFloat(locationServiceResp.results[0].geometry.location.lat)];


						// call database service
						db.add_community(community, function (dberr, savedCommunity) {
							if (dberr) {
								res.status(404).send({ "status": "error", "message": "Database error encountered", "error": dberr });
							} else {
								if (savedCommunity) {
									res.status(200).send({ "status": "success", "data": savedCommunity });
								} else {
									res.status(404).send({ "status": "error", "message": "Something went wrong when saving to database." });
								}
							}
						});

					} else {

						res.status(404).send({ "status": "error", "message": "Unable to locate " + flattenedAddress + " on the map." });

					}
				} else {

					res.status(404).send({ "status": "error", "message": "No response from location service when attempting to locate " + flattenedAddress + " on the map." });

				}

			} else {

				res.status(404).send({ "status": "error", "message": "Error from location service when attempting to locate " + flattenedAddress + " on the map. : " + err });

			}

		})


	});

profileRouter.route('/partners')
	.get(function (req, res) {

		// Call database service with the requested Id for the community
		db.get_all_communities(function (dberr, queriedCommunities) {

			if (dberr) {
				res.status(404).send({ "status": "error", "message": "Database error encountered", "error": dberr });
			} else {
				if (queriedCommunities && queriedCommunities.length > 0) {
					var resp = [];
					for (i = 0; i < queriedCommunities.length; i++) {

						resp.push({
							"_id": queriedCommunities[i]._id,
							"partner_organization": queriedCommunities[i].partner_organization,
							"region": queriedCommunities[i].region,
							"country": queriedCommunities[i].country,
							"postal_code": queriedCommunities[i].postal_code,
							"program": queriedCommunities[i].program,
							"status": queriedCommunities[i].status,
							"type": queriedCommunities[i].type
						})

					}
					res.status(200).send({ "status": "success", "data": resp });
				} else {
					res.status(404).send({ "status": "error", "message": "No community records found" });
				}
			}
		});

	});

// API to get a community
profileRouter.route('/:id')
	.get(function (req, res) {

		// Call database service with the requested Id for the community
		db.get_community(req.params.id, function (dberr, queriedCommunity) {

			if (dberr) {
				res.status(404).send({ "status": "error", "message": "Database error encountered", "error": dberr });
			} else {
				if (queriedCommunity) {
					res.status(200).send({ "status": "success", "data": queriedCommunity });
				} else {
					res.status(404).send({ "status": "error", "message": "No community records found" });
				}
			}
		});

	});

// API to change status of a community
profileRouter.route('/:id/status/update/:newStatus')
	.put(function (req, res) {

		// Call database service with the requested Id for the community
		db.change_status(req.params.id, req.params.newStatus, function (dberr, updatedCommunity) {

			if (dberr) {
				res.status(404).send({ "status": "error", "message": "Database error encountered", "error": dberr });
			} else {
				if (updatedCommunity) {
					res.status(200).send({ "status": "success", "data": updatedCommunity });
				} else {
					res.status(404).send({ "status": "error", "message": "No community records found" });
				}
			}
		});

	});

// API to change program of a community
profileRouter.route('/:id/program/update/:newProgram')
	.put(function (req, res) {

		// Call database service with the requested Id for the community
		db.change_program(req.params.id, req.params.newProgram, function (dberr, updatedCommunity) {

			if (dberr) {
				res.status(404).send({ "status": "error", "message": "Database error encountered", "error": dberr });
			} else {
				if (updatedCommunity) {
					res.status(200).send({ "status": "success", "data": updatedCommunity });
				} else {
					res.status(404).send({ "status": "error", "message": "No community records found" });
				}
			}
		});

	});

// API to update the polygon of the community
profileRouter.route('/:id/polygon/update')
	.post(function (req, res) {

		//validate request has the right information
		if (!req.body.polygon) {
			res.status(404).send({ "status": "error", "message": "Call is missing polygon in body" });
			return;
		}

		// Call database service with the requested Id for the community
		db.add_modify_polygon(req.params.id, req.body.polygon, function (dberr, updatedCommunity) {

			if (dberr) {
				res.status(404).send({ "status": "error", "message": "Database error encountered", "error": dberr });
			} else {
				if (updatedCommunity) {
					res.status(200).send({ "status": "success", "data": updatedCommunity });
				} else {
					res.status(404).send({ "status": "error", "message": "No community records found" });
				}
			}
		});

	});

// API to remove the polygon of the community
profileRouter.route('/:id/polygon/remove')
	.post(function (req, res) {

		// Call database service with the requested Id for the community
		db.delete_polygon(req.params.id, function (dberr, updatedCommunity) {

			if (dberr) {
				res.status(404).send({ "status": "error", "message": "Database error encountered", "error": dberr });
			} else {
				if (updatedCommunity) {
					res.status(200).send({ "status": "success", "data": updatedCommunity });
				} else {
					res.status(404).send({ "status": "error", "message": "No community records found" });
				}
			}
		});

	});

// API to update the images of the community
profileRouter.route('/:id/images/update')
	.post(function (req, res) {

		//validate request has the right information
		if (!req.body.image_urls) {
			res.status(404).send({ "status": "error", "message": "Call is missing image urls in body" });
			return;
		}
		// Call database service with the requested Id for the community
		db.update_image_urls(req.params.id, req.body.image_urls, function (dberr, updatedCommunity) {

			if (dberr) {
				res.status(404).send({ "status": "error", "message": "Database error encountered", "error": dberr });
			} else {
				if (updatedCommunity) {
					res.status(200).send({ "status": "success", "data": updatedCommunity });
				} else {
					res.status(404).send({ "status": "error", "message": "No community records found" });
				}
			}
		});

	});


// API to update the DrinknDine images of the community
profileRouter.route('/:id/dandd_images/update')
	.post(function (req, res) {

		//validate request has the right information
		if (!req.body.dandd_image_urls) {
			res.status(404).send({ "status": "error", "message": "Call is missing DrinknDine image urls in body" });
			return;
		}
		// Call database service with the requested Id for the community
		db.update_dandd_image_urls(req.params.id, req.body.dandd_image_urls, function (dberr, updatedCommunity) {

			if (dberr) {
				res.status(404).send({ "status": "error", "message": "Database error encountered", "error": dberr });
			} else {
				if (updatedCommunity) {
					res.status(200).send({ "status": "success", "data": updatedCommunity });
				} else {
					res.status(404).send({ "status": "error", "message": "No community records found" });
				}
			}
		});

	});


// API to update the DrinknDine images of the community
profileRouter.route('/:id/shoph_images/update')
	.post(function (req, res) {

		//validate request has the right information
		if (!req.body.shoph_image_urls) {
			res.status(404).send({ "status": "error", "message": "Call is missing ShopHere image urls in body" });
			return;
		}
		// Call database service with the requested Id for the community
		db.update_shoph_image_urls(req.params.id, req.body.shoph_image_urls, function (dberr, updatedCommunity) {

			if (dberr) {
				res.status(404).send({ "status": "error", "message": "Database error encountered", "error": dberr });
			} else {
				if (updatedCommunity) {
					res.status(200).send({ "status": "success", "data": updatedCommunity });
				} else {
					res.status(404).send({ "status": "error", "message": "No community records found" });
				}
			}
		});

	});


// API to update the facts of the community
profileRouter.route('/:id/facts/update')
	.post(function (req, res) {

		//validate request has the right information
		if (!req.body.facts) {
			res.status(404).send({ "status": "error", "message": "Call is missing facts in body" });
			return;
		}

		// Call database service with the requested Id for the community
		db.update_facts(req.params.id, req.body.facts, function (dberr, updatedCommunity) {

			if (dberr) {
				res.status(404).send({ "status": "error", "message": "Database error encountered", "error": dberr });
			} else {
				if (updatedCommunity) {
					res.status(200).send({ "status": "success", "data": updatedCommunity });
				} else {
					res.status(404).send({ "status": "error", "message": "No community records found" });
				}
			}
		});

	});

// API to update the facts of the community
profileRouter.route('/:id/contacts/update')
	.post(function (req, res) {

		// validate request has the right information
		if (!req.body.contacts) {
			res.status(404).send({ "status": "error", "message": "Call is missing facts in body" });
			return;
		}

		// validate that there is atleast one contact
		if (req.body.contacts.length < 1) {
			res.status(404).send({ "status": "error", "message": "There must be atleast one contact for the community." });
			return;
		}

		// Validate the existance of all necessary information for each contact
		for (i = 0; i < req.body.contacts.length; i++) {

			if (!req.body.contacts[i].name || !req.body.contacts[i].email || !req.body.contacts[i].phone) {

				res.status(404).send({ "status": "error", "message": "Some contacts are missing mandatory fields." });
				return;

			}

		}

		// Call database service with the requested Id for the community
		db.update_contacts(req.params.id, req.body.contacts, function (dberr, updatedCommunity) {

			if (dberr) {
				res.status(404).send({ "status": "error", "message": "Database error encountered", "error": dberr });
			} else {
				if (updatedCommunity) {
					res.status(200).send({ "status": "success", "data": updatedCommunity });
				} else {
					res.status(404).send({ "status": "error", "message": "No community records found" });
				}
			}
		});

	});

// function to update any attribute of a community
profileRouter.route('/update')
	.post((req, res) => {

		var community = req.body;

		// validate request has the right information
		if (!req.body._id) {
			res.status(404).send({ "status": "error", "message": "Call is missing request information" });
			return;
		}


		// call the db function to update the user
		db.update_community(community)
			.then((data) => {
				res.status(200).send({ "status": "success", "data": data });
				return;
			})
			.catch((err) => {
				res.status(404).send({ "status": "error", "message": "Unable to update community" });
				return;
			})

	})

// API to get closest location
profileRouter.route('/:user_id/:lat/:lng')
	.get(function (req, res) {

		var reqUser = req.params.user_id;
		var reqLat = req.params.lat;
		var reqLng = req.params.lng;
		var reqProxInMiles = config.proximityInMiles;

		//convert configuration in miles to meters
		if (!reqProxInMiles || reqProxInMiles == null)
			reqProxInMiles = config.communityProximity;

		proximityInMeters = reqProxInMiles * 1609.344;

		db.get_current_community(reqLat, reqLng, proximityInMeters, function (resp) {

			if (resp.status == "success") {

				if (resp.communityList.length > 0) {
					var communityList = resp.communityList;
					var image_url = "";
					var fact = "";
					var welcomeMessage = config.fixedWelcomeMessage;
					var factMessage = config.fixedFactMessage;
					var partnerRecognitionPrefix = config.partnerRecognitionPrefix;

					// Find an image to send)
					if (communityList[0].image_urls && communityList[0].image_urls.length > 0) {
						image_url = communityList[0].image_urls[functions.getRandomInt(communityList[0].image_urls.length)];
					}

					if (communityList[0].facts && communityList[0].facts.length > 0) {
						fact = communityList[0].facts[functions.getRandomInt(communityList[0].facts.length)];
					}

					db.get_specials(reqLat, reqLng, proximityInMeters * 4, function (resp) {

						var responseObject = {
							"status": "success",
							"data": {
								"proximity_type": "near",
								"welcome_message": welcomeMessage,
								"name": communityList[0].display_name,
								"actual_name": communityList[0].name,
								"partner_organization": communityList[0].partner_organization,
								"partner_promotion_message": (communityList[0].partner_organization ? partnerRecognitionPrefix + communityList[0].partner_organization : ""),
								"country": communityList[0].country,
								"region": communityList[0].region,
								"postal_code": communityList[0].postal_code,
								"image_url": image_url,
								"fact_message": factMessage,
								"fact": fact,
								"status": communityList[0].status,
								"type": communityList[0].type,
								"program": communityList[0].program,
								"specials": (resp.specials) ? resp.specials : []
							}
						}

						res.status(200).send(responseObject);
						return;

					});

				} else {

					if (config.nrooteFacts.length > 0) {
						fact = config.nrooteFacts[functions.getRandomInt(config.nrooteFacts.length)];
					}

					db.get_specials(reqLat, reqLng, proximityInMeters * 4, function (resp) {

						var responseObject = {
							"status": "success",
							"data": {
								"proximity_type": "near",
								"welcome_message": config.nrooteWelcomeMessage,
								"name": config.nrooteCityName,
								"actual_name": "",
								"partner_organization": "",
								"country": "",
								"region": "",
								"postal_code": "",
								"image_url": config.nrooteImageUrl,
								"fact_message": config.nrooteFactMessage,
								"fact": fact,
								"status": "",
								"type": "",
								"program": "",
								"specials": (resp.specials) ? resp.specials : []
							}
						}

						res.status(200).send(responseObject);
						return;

					});

				}


			} else {

				// return the error condition
				res.status(404).send(resp);
				return;

			}

		});

	});


// API to get closest location
profileRouter.route('/dandd/:user_id/:lat/:lng')
	.get(function (req, res) {

		var reqUser = req.params.user_id;
		var reqLat = req.params.lat;
		var reqLng = req.params.lng;
		var reqProxInMiles = config.proximityInMiles;

		//convert configuration in miles to meters
		if (!reqProxInMiles || reqProxInMiles == null)
			reqProxInMiles = config.communityProximity;

		proximityInMeters = reqProxInMiles * 1609.344;

		db.get_current_dandd_community(reqLat, reqLng, proximityInMeters, function (resp) {

			if (resp.status == "success") {

				if (resp.communityList.length > 0) {
					var communityList = resp.communityList;
					var image_url = "";
					var fact = "";
					var welcomeMessage = config.fixedWelcomeMessage;
					var factMessage = config.fixedFactMessage;
					var partnerRecognitionPrefix = config.partnerRecognitionPrefix;

					// Find an image to send)
					if (communityList[0].dandd_image_urls && communityList[0].dandd_image_urls.length > 0) {
						image_url = communityList[0].dandd_image_urls[functions.getRandomInt(communityList[0].dandd_image_urls.length)];
					}

					if (communityList[0].facts && communityList[0].facts.length > 0) {
						fact = communityList[0].facts[functions.getRandomInt(communityList[0].facts.length)];
					}

					db.get_specials(reqLat, reqLng, proximityInMeters * 4, function (resp) {

						var responseObject = {
							"status": "success",
							"data": {
								"proximity_type": "near",
								"welcome_message": welcomeMessage,
								"name": communityList[0].display_name,
								"actual_name": communityList[0].name,
								"partner_organization": communityList[0].partner_organization,
								"partner_promotion_message": (communityList[0].partner_organization ? partnerRecognitionPrefix + communityList[0].partner_organization : ""),
								"country": communityList[0].country,
								"region": communityList[0].region,
								"postal_code": communityList[0].postal_code,
								"image_url": image_url,
								"fact_message": factMessage,
								"fact": fact,
								"status": communityList[0].status,
								"type": communityList[0].type,
								"program": communityList[0].program,
								"specials": (resp.specials) ? resp.specials : []
							}
						}

						res.status(200).send(responseObject);
						return;

					});

				} else {

					if (config.nrooteFacts.length > 0) {
						fact = config.nrooteFacts[functions.getRandomInt(config.nrooteFacts.length)];
					}

					db.get_specials(reqLat, reqLng, proximityInMeters * 4, function (resp) {

						var responseObject = {
							"status": "success",
							"data": {
								"proximity_type": "near",
								"welcome_message": config.nrooteWelcomeMessage,
								"name": config.danddCityName,
								"actual_name": "",
								"partner_organization": "",
								"country": "",
								"region": "",
								"postal_code": "",
								"image_url": config.nrooteImageUrl,
								"fact_message": config.nrooteFactMessage,
								"fact": fact,
								"status": "",
								"type": "",
								"program": "",
								"specials": (resp.specials) ? resp.specials : []
							}
						}

						res.status(200).send(responseObject);
						return;

					});

				}


			} else {

				// return the error condition
				res.status(404).send(resp);
				return;

			}

		});

	});

// API to get closest location
profileRouter.route('/shoph/:user_id/:lat/:lng')
	.get(function (req, res) {

		var reqUser = req.params.user_id;
		var reqLat = req.params.lat;
		var reqLng = req.params.lng;
		var reqProxInMiles = config.proximityInMiles;

		//convert configuration in miles to meters
		if (!reqProxInMiles || reqProxInMiles == null)
			reqProxInMiles = config.communityProximity;

		proximityInMeters = reqProxInMiles * 1609.344;

		db.get_current_shoph_community(reqLat, reqLng, proximityInMeters, function (resp) {

			if (resp.status == "success") {

				if (resp.communityList.length > 0) {
					var communityList = resp.communityList;
					var image_url = "";
					var fact = "";
					var welcomeMessage = config.fixedWelcomeMessage;
					var factMessage = config.fixedFactMessage;
					var partnerRecognitionPrefix = config.partnerRecognitionPrefix;

					// Find an image to send)
					if (communityList[0].shoph_image_urls && communityList[0].shoph_image_urls.length > 0) {
						image_url = communityList[0].shoph_image_urls[functions.getRandomInt(communityList[0].shoph_image_urls.length)];
					}

					if (communityList[0].facts && communityList[0].facts.length > 0) {
						fact = communityList[0].facts[functions.getRandomInt(communityList[0].facts.length)];
					}

					db.get_specials(reqLat, reqLng, proximityInMeters * 4, function (resp) {

						var responseObject = {
							"status": "success",
							"data": {
								"proximity_type": "near",
								"welcome_message": welcomeMessage,
								"name": communityList[0].display_name,
								"actual_name": communityList[0].name,
								"partner_organization": communityList[0].partner_organization,
								"partner_promotion_message": (communityList[0].partner_organization ? partnerRecognitionPrefix + communityList[0].partner_organization : ""),
								"country": communityList[0].country,
								"region": communityList[0].region,
								"postal_code": communityList[0].postal_code,
								"image_url": image_url,
								"fact_message": factMessage,
								"fact": fact,
								"status": communityList[0].status,
								"type": communityList[0].type,
								"program": communityList[0].program,
								"specials": (resp.specials) ? resp.specials : []
							}
						}

						res.status(200).send(responseObject);
						return;

					});

				} else {

					if (config.nrooteFacts.length > 0) {
						fact = config.nrooteFacts[functions.getRandomInt(config.nrooteFacts.length)];
					}

					db.get_specials(reqLat, reqLng, proximityInMeters * 4, function (resp) {

						var responseObject = {
							"status": "success",
							"data": {
								"proximity_type": "near",
								"welcome_message": config.nrooteWelcomeMessage,
								"name": config.shophCityName,
								"actual_name": "",
								"partner_organization": "",
								"country": "",
								"region": "",
								"postal_code": "",
								"image_url": config.nrooteImageUrl,
								"fact_message": config.nrooteFactMessage,
								"fact": fact,
								"status": "",
								"type": "",
								"program": "",
								"specials": (resp.specials) ? resp.specials : []
							}
						}

						res.status(200).send(responseObject);
						return;

					});

				}


			} else {

				// return the error condition
				res.status(404).send(resp);
				return;

			}

		});

	});

module.exports = profileRouter;