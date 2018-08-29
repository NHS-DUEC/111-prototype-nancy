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
    var postcode = req.body['postcode']
    // strip spaces
    var cleaned = postcode.replace(/\s+/g, '').toLowerCase();
    var building = req.body['building'];

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
              // Nothing found for this combo of building / postcode
              // So just display the postcode results?
              res.render('tell-us-where-you-are/address-list.html', {
                'message' : 'No exact match found, showing all addresses for',
                'addresses' : addresses,
                'postcode' : postcode
              });
            } else {
              res.render('tell-us-where-you-are/address-list.html', {
                'addresses' : filtered,
                'postcode' : postcode
              });
            }

          } else {

            res.render('tell-us-where-you-are/address-list.html', {
              'addresses' : addresses,
              'postcode' : postcode
            });

          }

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
  res.redirect('/finding-pathways/start');
});

router.get('/handle-address', function (req, res) {
  req.session.addressSelected = req.query.str;
  res.redirect('/finding-pathways/start');
});
