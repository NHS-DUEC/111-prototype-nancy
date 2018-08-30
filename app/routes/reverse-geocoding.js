var express = require('express')
var googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLEMAPS_API
});
var router = express.Router()

module.exports = router

// Just a test
router.get('/', function(req, res) {
  // Geocode an address.
  googleMapsClient.reverseGeocode({
    'latlng' : [51.483472669952434, -0.24388435000003028]
  }, function(err, response) {
    if (err) {
      res.send(err);
    }
    if (!err) {
      res.send(response);
    }
  });
});
