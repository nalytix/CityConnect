var mongoose = require('mongoose');

// Offer can be on item or total amount
offerTypeSchema = new mongoose.Schema({
    offer_on: String, // 'item' or 'cart'
    offer_value_amount: String,
    offer_value_percentage: String,
    menu_id: String // If offer_on is 'item'
})
mongoose.model('OfferType', offerTypeSchema);

var OfferSchema = new mongoose.Schema({

    offer_title: String,
    store_name: String,    
    business_id: String,
    location_name: String,    
    location_id: String,
    location_coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    offer_type: offerTypeSchema,
    short_desc: String,
    long_desc: String,
    image_url: String,
    start_date: Date,
    end_date: Date,
    preview_start_date: Date,
    subscribers: [String]
});
var Offer = mongoose.model('Offer', OfferSchema);

module.exports = Offer;