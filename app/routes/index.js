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

router.post('/clinical-callback/clinical-callback', function (req, res) {

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
    res.redirect('details_2');
    // res.render('clinical-callback/details_2', {
    //   session: req.session
    // }); 

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
    //     // res.render('v1_1/home-address-postcode', {
    //     //   error: {
    //     //     general: 'Sorry, there’s been a problem looking up your address. Please try again.'
    //     //   },
    //     //   session: req.session
    //     // });
    //   }
    // });
  }
})
// Check person +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.post('/clinical-callback/check-person', function (req, res) {
  res.render('clinical-callback/details_2', {
    session: req.session
  });
})

// Contact details - single page contact form +++++++++++++++++++++++++++++++++

router.get('/clinical-callback/details_2', function (req, res) {
  res.render('clinical-callback/details_2', {
    session: req.session
  });

});

router.post('/clinical-callback/details_2', function (req, res) {
  res.redirect('confirm_details');
  // res.render('/clinical-callback/confirm-details', {
  //   session: req.session
  // });
})

