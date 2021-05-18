var express = require('express');
var offerRouter = express.Router();
var db = require('../libraries/mongo');


//Add Offer
offerRouter.route('/add').post((req,res) => {
    
    db.add_offer(req.body)
                .then((data) => {
                    res.status(200).send({"status": "success", "data": data});
                })
                .catch((err) => {
                    res.status(404).send({"status": "error", "message": "Database error encountered", "stack": err});
                })

});

//Get Offers
offerRouter.route('/get').post((req,res) => {

    if (!req.body.lat || !req.body.lng) {
        // send an error response
        res.status(404).send({"status": "error",  "message": "missing required info"});
        return;
    }

    db.get_offer(req.body.lat, req.body.lng)
                .then((data) => {
                    res.status(200).send({"status": "success", "data": data});
                    return;
                })
                .catch((err) => {
                    res.status(404).send({"status": "error",  "message": "Database error encountered", "stack": err});
                    return;
                })

});

module.exports = offerRouter;