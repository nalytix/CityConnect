var express = require('express');
var offerRouter = express.Router();
var db = require('../libraries/mongo');


//Add Offer
offerRouter.route('/add').post((req,res) => {
    

    db.add_offer(req.body, function(dberr, savedOffer) {
        if (dberr) {
            res.status(404).send({ "status": "error", "message": "Database error encountered", "error": dberr });
        } else {
            if (savedOffer) {
                res.status(200).send({ "status": "success", "data": savedOffer });
            } else {
                res.status(404).send({ "status": "error", "message": "Something went wrong when saving to database." });
            }
        }
    });

});

//Get Offers
offerRouter.route('/get').post((req,res) => {

    if (!req.body.lat || !req.body.lng) {
        // send an error response
        res.status(404).send({"status": "error",  "message": "missing required info"});
        return;
    }

    db.get_offer(req.body.lat, req.body.lng, req.body.offerIds, function(dberr, queriedOffers) {

        if (dberr) {
            res.status(404).send({ "status": "error", "message": "Database error encountered", "error": dberr });
        } else {
            if (queriedOffers) {
                res.status(200).send({ "status": "success", "data": queriedOffers });
            } else {
                res.status(404).send({ "status": "error", "message": "No offers found" });
            }
        }

    });

});

module.exports = offerRouter;