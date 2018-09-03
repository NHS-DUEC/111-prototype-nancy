var express = require('express')
var moment = require('moment-timezone')
var request = require('request')
var naturalSort = require('javascript-natural-sort')
var router = express.Router()

module.exports = router

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Journey to questions - August 2018 ++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.post('/demographics', function(req, res) {
  // "Adult" is 16+
  // Set a default here if there's a lack of req.query
  // Male
  // Adult (40)
  if (!req.session.demographics) {
    // zero out a namespaced session obj with defaults
    req.session.demographics = {};
    req.session.demographics.sex = 'Male';
    req.session.demographics.age = '40';
    req.session.demographics.ageCategory = 'Adult';
    req.session.demographics.dob = {};
    req.session.demographics.dob.day = '23';
    req.session.demographics.dob.month = '5';
    req.session.demographics.dob.year = '1977';
    req.session.demographics.dob.supplied = false;
  }
  if (req.body['dob-day'] !== '' && req.body['dob-month'] !== '' && req.body['dob-year'] !== '') {
    var year = req.body['dob-year']
    var month = req.body['dob-month']
    var day = req.body['dob-day']

    var dob = moment().set({
      'year': year,
      'month': month,
      'date': day
    });

    var age = moment().diff(dob, 'years')

    var ageCategory = 'Adult';
    if (age < 16) {
      ageCategory = 'Child';
    }

    req.session.demographics.dob.year = year;
    req.session.demographics.dob.month = month;
    req.session.demographics.dob.day = day;
    req.session.demographics.dob.supplied = true;
    req.session.demographics.age = age;
    req.session.demographics.ageCategory = ageCategory;

  } else if (req.body['age'] !== '') {

    var age = Number(req.body['age']);

    var ageCategory = 'Adult';
    if (age < 16) {
      ageCategory = 'Child';
    }

    req.session.demographics.dob.year = '';
    req.session.demographics.dob.month = '';
    req.session.demographics.dob.day = '';
    req.session.demographics.dob.supplied = false;
    req.session.demographics.age = age;
    req.session.demographics.ageCategory = ageCategory;
  }
  if (req.body['sex']) {
    req.session.demographics.sex = req.body['sex'];
  }
  res.redirect('/start/address-search');
});

// -----------------------------------------------------------------------------

router.post('/address-search', function (req, res) {

  if (req.body['postcode'] === '') {
    res.render('start/address-search.html', {
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
              message = 'No exact match found &mdash; showing all addresses for ' + postcode;
            } else {
              addresses = filtered;
            }
          }

          req.session.addressResults = addresses;
          req.session.addressBuilding = building;
          req.session.addressPostcode = postcode;

          res.render('start/address-list.html', {
            message : message
          });

        }

      } else {
        res.render('start/address-search.html', {
          error : {
            summary : 'There’s been a problem looking up your address. Please try again.'
          }
        });
      }
    });
  }
});

// -----------------------------------------------------------------------------

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
  res.redirect('/start/handle-address?str=' + address);
});

// -----------------------------------------------------------------------------

router.get('/handle-address', function (req, res) {
  req.session.addressSelected = req.query.str;
  res.redirect('/finding-pathways/start');
});

// -----------------------------------------------------------------------------

router.post('/handle-location', function (req, res) {
  var latlongLocation = {};
  latlongLocation.lat = req.body['lat'];
  latlongLocation.long = req.body['long'];
  req.session.latlongLocation = latlongLocation;
  res.redirect('/finding-pathways/start');
});
