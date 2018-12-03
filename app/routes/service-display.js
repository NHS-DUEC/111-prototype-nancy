var express = require('express')
var router = express.Router()

module.exports = router

// -----------------------------------------------------------------------------

router.post('/change-location', function(req, res) {
  if (req.body['postcode'] !== '') {
    /*req.session.postcode = req.body['postcode'];
    req.session.postcodesource = 'user';*/
    res.redirect('/finding-pathways/start');
  } else {
    res.render('service-display/change-location.html', {
      error : true
    });
  }
});

// -----------------------------------------------------------------------------
