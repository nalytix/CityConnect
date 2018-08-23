var mongoose = require('mongoose');
var Community = require('../models/community');


// Database Service to add a new community
var add_community = function(communityObj, callback){
	
	newCommunity = new Community(communityObj);
	
	newCommunity.coordinates = {
		"type": "Point", 
		"coordinates": communityObj.latlng
	};
	
	newCommunity.save(function(dberr, savedObj){
		
		if(dberr){
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
var get_community = function(communityId, callback){
	
	Community.findById(communityId, function(dberr, queriedCommunity){
		
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

var change_status = function(communityId, newStatus, callback){
	
	Community.findByIdAndUpdate(communityId, {"status": newStatus}, function(dberr, updatedCommunity){
		
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

var change_program = function(communityId, newProgram, callback){
	
	Community.findByIdAndUpdate(communityId, {"program": newProgram}, function(dberr, updatedCommunity){
		
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
var add_modify_polygon = function(communityId, polygon, callback){
	
	newPolygon = {
		"type": "Polygon",
		coordinates: polygon
	};
	
	Community.findByIdAndUpdate(communityId, { polygon : newPolygon }, function( dberr, updatedCommunity ){
		
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
var delete_polygon = function(communityId, callback){
	
	Community.findByIdAndUpdate(communityId, {$unset: { polygon : 1 }}, function( dberr, updatedCommunity ){
		
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
var update_image_urls = function(communityId, urls, callback){
	
	Community.findByIdAndUpdate(communityId, { image_urls : urls }, function( dberr, updatedCommunity ){
		
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


// Database service to update the list of facts associated with a community
var update_facts = function(communityId, facts, callback){
	
	Community.findByIdAndUpdate(communityId, { "facts" : facts }, function( dberr, updatedCommunity ){
		
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
var update_contacts = function(communityId, contacts, callback){
	
	Community.findByIdAndUpdate(communityId, { "contacts" : contacts }, function( dberr, updatedCommunity ){
		
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

var get_current_community = function(lat, lng, proxInMeters, callback){
	
	Community.find( { coordinates: 
							{ $nearSphere:
								{ $geometry: 
									{ type: "Point", 
									  coordinates: [lng, lat] 
									},
									"$minDistance": 0,
									"$maxDistance": proxInMeters
								}
								
							} 
						}, 
						function(err, communityList){
							
							if (!err)
								callback({"status": "success", "communityList":communityList});
							else 
								callback({"status": "error", "error_msg":err});
							
						}
	);
	
};

// Database Service to retrieve a community based on Id
var get_all_communities = function(callback){
	
	Community.find({}, function(dberr, queriedCommunities){

		if (dberr) {
			
			callback({
					"error_code": 404,
					"error_name": "DBError",
					"error_message": dberr
				},
				null
			);
			
		} else {
			
			if ( queriedCommunities && queriedCommunities.length > 0 ) {

				
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

module.exports = {
	
	add_community: add_community,
	get_community: get_community,
	change_status: change_status,
	change_program: change_program,
	add_modify_polygon: add_modify_polygon,
	delete_polygon: delete_polygon,
	update_image_urls: update_image_urls,
	update_facts: update_facts,
	update_contacts: update_contacts,
	get_current_community: get_current_community,
	get_all_communities: get_all_communities

};
