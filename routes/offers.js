var express = require('express');
var request = require('request');
var specialsRouter = express.Router();
var db = require('../libraries/mongo');
var config = require('../configs/config');
var functions = require('../libraries/utilities');


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

module.exports = offerRouter;