var express = require('express')
var request = require('request')
var naturalSort = require('javascript-natural-sort')
var router = express.Router()

module.exports = router

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Tell us where you are - August 2018 +++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.post('/address-search', function (req, res) {

  if (req.body['postcode'] === '') {
    res.render('tell-us-where-you-are/address-search.html', {
      error : {
        summary : '<a href="#postcode">Please enter a postcode</a>',
        postcode: 'Postcode is required'
      }
    });
  } else {
    var postcode = req.body['postcode'].toUpperCase();
    // strip spaces
    var cleaned = postcode.replace(/\s+/g, '').toLowerCase();
    var building = req.body['building'];
    var message = '';

    request('https://api.getAddress.io/v2/uk/' + cleaned + '/?api-key=' + process.env.POSTCODE_API + '&format=true', function (error, response, body) {
      if (!error) {
        if (response.statusCode == 200) {
          var parsed = JSON.parse(body);
          var addresses = parsed['Addresses'];
          addresses.sort(naturalSort);
          var filtered = [];

          if (building !== '') {
            for (var i=0; i<addresses.length; i++) {
              var current = addresses[i].toString().toLowerCase();
              if (current.indexOf(building.toLowerCase()) !== -1) {
                filtered.push(addresses[i]);
              }
            }
            if (filtered.length === 0) {
              message = 'No exact match found, showing all addresses for ' + postcode;
            } else {
              addresses = filtered;
            }
          }

          req.session.addressResults = addresses;
          req.session.addressPostcode = postcode

          res.render('tell-us-where-you-are/address-list.html', {
            message : message
          });

        }

      } else {
        res.render('tell-us-where-you-are/address-search.html', {
          error : {
            summary : 'Sorry, there’s been a problem looking up your address. Please try again.'
          }
        });
      }
    });
  }
})

router.post('/manual-address', function (req, res) {
  var address = '';
  if (req.body['address_1'] !== '') {
    address += req.body['address_1'] + ', '
  }
  if (req.body['address_2'] !== '') {
    address += req.body['address_2'] + ', '
  }
  if (req.body['address_3'] !== '') {
    address += req.body['address_3'] + ', '
  }
  if (req.body['address_4'] !== '') {
    address += req.body['address_4'] + ', '
  }
  if (req.body['postcode'] !== '') {
    address += req.body['postcode'] + ', '
  }
  address = address.slice(0, -2);
  res.redirect('/tell-us-where-you-are/handle-address?str=' + address);
});

router.get('/handle-address', function (req, res) {
  req.session.addressSelected = req.query.str;
  res.redirect('/finding-pathways/start');
});

router.post('/handle-location', function (req, res) {
  var latlongLocation = {};
  latlongLocation.lat = req.body['lat'];
  latlongLocation.long = req.body['long'];
  req.session.latlongLocation = latlongLocation;
  res.redirect('/finding-pathways/start');
});
