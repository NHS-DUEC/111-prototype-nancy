var express = require('express')
var router = express.Router()

router.get('/', function (req, res) {
  req.session.destroy();
  res.render('index.html');
});

module.exports = router

// Postcode ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.get('/clinical-callback', function (req, res) {
  res.render('clinical-callback/clinical-callback', {
    session: req.session
  });
});

router.post('/clinical-callback', function (req, res) {

  req.session.postcode = req.body['postcode'];
  req.session.building = req.body['building'];

  if (req.body['postcode'] === '') {
    res.render('clinical-callback/clinical-callback', {
      session: req.session,
      error: {
        postcode: 'Please enter your home postcode'
      }
    });
  } else {
    // strip spaces
    // var cleaned = req.session.postcode.replace(/\s+/g, '').toLowerCase();

    // request('https://api.getAddress.io/v2/uk/' + cleaned + '/?api-key=' + postcode_api + '&format=true', function (error, response, body) {
    //   if (!error) {
    //     if (response.statusCode == 200) {
    //       var parsed = JSON.parse(body);
    //       var addresses = parsed['Addresses'];
    //       addresses.sort(naturalSort);
    //       var filtered = [];

    //       if (req.session.building !== '') {
    //         for (var i=0; i<addresses.length; i++) {
    //           //var current = addresses[i][0];
    //           var current = addresses[i].toString().toLowerCase();
    //           if (current.indexOf(req.session.building.toLowerCase()) !== -1) {
    //             filtered.push(addresses[i]);
    //           }
    //         }

    //         if (filtered.length === 0) {
    //           // Nothing found for this combo of building / postcode
    //           // So just display the postcode results?
    //           req.session.addressResults = addresses;
    //           res.render('v1_1/home-address-result', {
    //             message: 'No exact match has been found, showing all addresses for ' + req.session.postcode,
    //             session: req.session
    //           });
    //         } else {
    //           req.session.addressResults = filtered;
    //           res.render('v1_1/home-address-result', {
    //             session: req.session
    //           });
    //         }

    //       } else {

    //         req.session.addressResults = addresses;

    //         res.render('v1_1/home-address-result', {
    //           session: req.session
    //         });

    //       }
    //     }

    //   } else {
    //     res.render('v1_1/home-address-postcode', {
    //       error: {
    //         general: 'Sorry, there’s been a problem looking up your address. Please try again.'
    //       },
    //       session: req.session
    //     });
    //   }
    // });
  }
})

// Address selection +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.get('/select-address', function (req, res) {
  res.render('v1_1/select-address', {
    session: req.session
  });
});

router.post('/select-address', function (req, res) {

  if (!req.body['address']) {
    res.render('v1_1/home-address-result', {
      error: 'Please select your home address',
      session: req.session
    });
  } else {
    req.session.address = req.body['address'].split(',');
    if (req.session.edit === true) {
      res.redirect('confirm-details')
    } else {
      res.redirect('contact-details')
    }
  }
})

// Manual address entry ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.get('/home-address-manual', function (req, res) {
  res.render('v1_1/home-address-manual', {
    session: req.session
  });
});

router.post('/home-address-manual', function (req, res) {

  req.session.address = [
    req.body['address-1'],
    req.body['address-2'],
    req.body['address-3'],
    req.body['address-4']
  ];
  req.session.postcode = req.body['postcode'];

  if (!req.body['address-1'] && !req.body['address-4']) {
    res.render('v1_1/home-address-manual', {
      error: 'Please enter your full address',
      session: req.session
    });
  } else if (req.session.edit === true) {
    res.redirect('confirm-details')
  } else {
    res.redirect('contact-details')
  }

})