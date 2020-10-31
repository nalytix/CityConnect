var mongoose = require('mongoose');
var Community = require('../models/community');
var Special = require('../models/community_specials');


// Database Service to add a new community
var add_community = function (communityObj, callback) {

	newCommunity = new Community(communityObj);

	newCommunity.coordinates = {
		"type": "Point",
		"coordinates": communityObj.latlng
	};

	newCommunity.save(function (dberr, savedObj) {

		if (dberr) {
			callback({
				"error_code": 404,
				"error_name": "DBError",
				"error_message": dberr
			},
				null
			);
		} else {

			if (savedObj) {

				callback(null, savedObj);

			} else {

				callback({
					"error_code": 404,
					"error_name": "NotFound",
					"error_message": "Db did not return saved object"
				},
					null
				);

			}

		}

	});

};

// Database Service to retrieve a community based on Id
var get_community = function (communityId, callback) {

	Community.findById(communityId, function (dberr, queriedCommunity) {

		if (dberr) {

			callback({
				"error_code": 404,
				"error_name": "DBError",
				"error_message": dberr
			},
				null
			);

		} else {

			if (queriedCommunity) {

				callback(null, queriedCommunity);

			} else {

				callback({
					"error_code": 404,
					"error_name": "NotFound",
					"error_message": "Db did not return object"
				},
					null
				);

			}

		}

	});

};

var change_status = function (communityId, newStatus, callback) {

	Community.findByIdAndUpdate(communityId, { "status": newStatus }, function (dberr, updatedCommunity) {

		if (dberr) {

			callback({
				"error_code": 404,
				"error_name": "DBError",
				"error_message": dberr
			},
				null
			);

		} else {

			if (updatedCommunity) {

				updatedCommunity.status = newStatus; //this line is here because the returned document is the previous version
				callback(null, updatedCommunity);

			} else {

				callback({
					"error_code": 404,
					"error_name": "NotFound",
					"error_message": "Db did not return object"
				},
					null
				);

			}

		}

	});

};

var change_program = function (communityId, newProgram, callback) {

	Community.findByIdAndUpdate(communityId, { "program": newProgram }, function (dberr, updatedCommunity) {

		if (dberr) {

			callback({
				"error_code": 404,
				"error_name": "DBError",
				"error_message": dberr
			},
				null
			);

		} else {

			if (updatedCommunity) {

				updatedCommunity.program = newProgram; //this line is here because the returned document is the previous version
				callback(null, updatedCommunity);

			} else {

				callback({
					"error_code": 404,
					"error_name": "NotFound",
					"error_message": "Db did not return object"
				},
					null
				);

			}

		}

	});

};

// Database Service to add or update the polygon on a community
var add_modify_polygon = function (communityId, polygon, callback) {

	newPolygon = {
		"type": "Polygon",
		coordinates: polygon
	};

	Community.findByIdAndUpdate(communityId, { polygon: newPolygon }, function (dberr, updatedCommunity) {

		if (dberr) {

			callback({
				"error_code": 404,
				"error_name": "DBError",
				"error_message": dberr
			},
				null
			);

		} else {

			if (updatedCommunity) {

				updatedCommunity.polygon = newPolygon; //this line is here because the returned document is the previous version
				callback(null, updatedCommunity);

			} else {

				callback({
					"error_code": 404,
					"error_name": "NotFound",
					"error_message": "Db did not return object"
				},
					null
				);

			}

		}

	})

};


// Database service to remove the polygon set on a community
var delete_polygon = function (communityId, callback) {

	Community.findByIdAndUpdate(communityId, { $unset: { polygon: 1 } }, function (dberr, updatedCommunity) {

		if (dberr) {

			callback({
				"error_code": 404,
				"error_name": "DBError",
				"error_message": dberr
			},
				null
			);

		} else {

			if (updatedCommunity) {

				updatedCommunity.polygon = undefined; //this line is here because the returned document is the previous version
				callback(null, updatedCommunity);

			} else {

				callback({
					"error_code": 404,
					"error_name": "NotFound",
					"error_message": "Db did not return object"
				},
					null
				);

			}

		}

	})

};

// Database service to update the list of images to promote a community
var update_image_urls = function (communityId, urls, callback) {

	Community.findByIdAndUpdate(communityId, { image_urls: urls }, function (dberr, updatedCommunity) {

		if (dberr) {

			callback({
				"error_code": 404,
				"error_name": "DBError",
				"error_message": dberr
			},
				null
			);

		} else {

			if (updatedCommunity) {

				updatedCommunity.image_urls = urls; //this line is here because the returned document is the previous version
				callback(null, updatedCommunity);

			} else {

				callback({
					"error_code": 404,
					"error_name": "NotFound",
					"error_message": "Db did not return object"
				},
					null
				);

			}

		}

	})

};


// Database service to update the list of dandd images to promote a community
var update_dandd_image_urls = function (communityId, urls, callback) {

	Community.findByIdAndUpdate(communityId, { dandd_image_urls: urls }, function (dberr, updatedCommunity) {

		if (dberr) {

			callback({
				"error_code": 404,
				"error_name": "DBError",
				"error_message": dberr
			},
				null
			);

		} else {

			if (updatedCommunity) {

				updatedCommunity.dandd_image_urls = urls; //this line is here because the returned document is the previous version
				callback(null, updatedCommunity);

			} else {

				callback({
					"error_code": 404,
					"error_name": "NotFound",
					"error_message": "Db did not return object"
				},
					null
				);

			}

		}

	})

};


// Database service to update the list of dandd images to promote a community
var update_shoph_image_urls = function (communityId, urls, callback) {

	Community.findByIdAndUpdate(communityId, { shoph_image_urls: urls }, function (dberr, updatedCommunity) {

		if (dberr) {

			callback({
				"error_code": 404,
				"error_name": "DBError",
				"error_message": dberr
			},
				null
			);

		} else {

			if (updatedCommunity) {

				updatedCommunity.shoph_image_urls = urls; //this line is here because the returned document is the previous version
				callback(null, updatedCommunity);

			} else {

				callback({
					"error_code": 404,
					"error_name": "NotFound",
					"error_message": "Db did not return object"
				},
					null
				);

			}

		}

	})

};


// Database service to update the list of facts associated with a community
var update_facts = function (communityId, facts, callback) {

	Community.findByIdAndUpdate(communityId, { "facts": facts }, function (dberr, updatedCommunity) {

		if (dberr) {

			callback({
				"error_code": 404,
				"error_name": "DBError",
				"error_message": dberr
			},
				null
			);

		} else {

			if (updatedCommunity) {

				updatedCommunity.facts = facts; //this line is here because the returned document is the previous version
				callback(null, updatedCommunity);

			} else {

				callback({
					"error_code": 404,
					"error_name": "NotFound",
					"error_message": "Db did not return object"
				},
					null
				);

			}

		}

	})

};

// Database service to update the list of contacts for a community
var update_contacts = function (communityId, contacts, callback) {

	Community.findByIdAndUpdate(communityId, { "contacts": contacts }, function (dberr, updatedCommunity) {

		if (dberr) {

			callback({
				"error_code": 404,
				"error_name": "DBError",
				"error_message": dberr
			},
				null
			);

		} else {

			if (updatedCommunity) {

				updatedCommunity.contacts = contacts; //this line is here because the returned document is the previous version
				callback(null, updatedCommunity);

			} else {

				callback({
					"error_code": 404,
					"error_name": "NotFound",
					"error_message": "Db did not return object"
				},
					null
				);

			}

		}

	})

};

var get_current_community = function (lat, lng, proxInMeters, callback) {

	Community.find({
		coordinates:
		{
			$nearSphere:
			{
				$geometry:
				{
					type: "Point",
					coordinates: [lng, lat]
				},
				"$minDistance": 0,
				"$maxDistance": proxInMeters
			}

		}
	},
		function (err, communityList) {



			if (!err) {

				var filteredCommunityList = [];

				for (var i = 0; i < communityList.length; i++) {

					if (communityList[i].nroote_partner) filteredCommunityList.push(communityList[i]);

				}

				callback({ "status": "success", "communityList": filteredCommunityList });

			} else
				callback({ "status": "error", "error_msg": err });

		}
	);

};


var get_current_dandd_community = function (lat, lng, proxInMeters, callback) {

	Community.find({
		coordinates:
		{
			$nearSphere:
			{
				$geometry:
				{
					type: "Point",
					coordinates: [lng, lat]
				},
				"$minDistance": 0,
				"$maxDistance": proxInMeters
			}

		}
	},
		function (err, communityList) {



			if (!err) {

				var filteredCommunityList = [];

				for (var i = 0; i < communityList.length; i++) {

					if (communityList[i].dandd_partner) filteredCommunityList.push(communityList[i]);

				}

				callback({ "status": "success", "communityList": filteredCommunityList });

			} else
				callback({ "status": "error", "error_msg": err });

		}
	);

};


var get_current_shoph_community = function (lat, lng, proxInMeters, callback) {

	Community.find({
		coordinates:
		{
			$nearSphere:
			{
				$geometry:
				{
					type: "Point",
					coordinates: [lng, lat]
				},
				"$minDistance": 0,
				"$maxDistance": proxInMeters
			}

		}
	},
		function (err, communityList) {



			if (!err) {

				var filteredCommunityList = [];

				for (var i = 0; i < communityList.length; i++) {

					if (communityList[i].shoph_partner) filteredCommunityList.push(communityList[i]);

				}

				callback({ "status": "success", "communityList": filteredCommunityList });

			} else
				callback({ "status": "error", "error_msg": err });

		}
	);

};

// Database Service to retrieve a community based on Id
var get_all_communities = function (callback) {

	Community.find({}, function (dberr, queriedCommunities) {

		if (dberr) {

			callback({
				"error_code": 404,
				"error_name": "DBError",
				"error_message": dberr
			},
				null
			);

		} else {

			if (queriedCommunities && queriedCommunities.length > 0) {

				callback(null, queriedCommunities);

			} else {

				callback({
					"error_code": 404,
					"error_name": "NotFound",
					"error_message": "Db did not return object"
				},
					null
				);

			}

		}

	});

};


// Database API to add specials
var add_special = function (specialObject, callback) {

	var special = new Special(specialObject);

	special.coordinates = {
		"type": "Point",
		"coordinates": specialObject.latlng
	};

	special.save(function (saveErr, savedObject) {

		if (saveErr) {

			callback({
				"error_code": 404,
				"error_name": "DBError",
				"error_message": "Database error when saving special",
				"stack": saveErr
			},
				null
			);
			return;

		} else {

			callback(null, savedObject);
			return;

		}

	})

};

// function to return specials within miles of a user
var get_specials = function (lat, lng, proxInMeters, callback) {

	Special.find({
		coordinates:
		{
			$nearSphere:
			{
				$geometry:
				{
					type: "Point",
					coordinates: [lng, lat]
				},
				"$minDistance": 0,
				"$maxDistance": proxInMeters
			}

		}
	},
		function (err, specialsList) {

			if (!err) {
				var activeList = [];

				var now = new Date();

				for (i = 0; i < specialsList.length; i++) {

					if (specialsList[i].start_date <= now && specialsList[i].end_date >= now) activeList.push(specialsList[i]);

				}
				callback({ "status": "success", "specials": activeList });
				return;
			} else {
				callback({ "status": "error", "error_msg": err });
				return;
			}
		}
	);

}


var update_community = (community) => {

	return new Promise((resolve, reject) => {

		Community.findById(community._id, (err, communityDoc) => {

			if (!err) {
				// update all the atributes that were sent in the payload (parameter to the function)

				if (communityDoc) {

					for (var att in community) {

						(att != "_id") ? communityDoc[att] = community[att] : null;

					}

					communityDoc.save((saveErr, savedDoc) => {
						if (saveErr) {
							reject({
								"error_code": 404,
								"error_name": "DBError",
								"error_message": "Error occurred when saving community",
								"stack": saveErr
							})
						} else {
							resolve(savedDoc);
						}
					})

				}

			} else {
				reject({
					"error_code": 404,
					"error_name": "DBError",
					"error_message": "Error occurred when querying community",
					"stack": err
				});
			}
		})

	})

}


module.exports = {

	add_community: add_community,
	get_community: get_community,
	change_status: change_status,
	change_program: change_program,
	add_modify_polygon: add_modify_polygon,
	delete_polygon: delete_polygon,
	update_image_urls: update_image_urls,
	update_dandd_image_urls: update_dandd_image_urls,
	update_shoph_image_urls: update_shoph_image_urls,
	update_facts: update_facts,
	update_contacts: update_contacts,
	get_current_community: get_current_community,
	get_current_dandd_community: get_current_dandd_community,
	get_current_shoph_community: get_current_shoph_community,
	get_all_communities: get_all_communities,
	add_special: add_special,
	get_specials: get_specials,
	update_community: update_community

};
