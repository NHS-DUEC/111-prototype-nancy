var express = require('express')
var request = require('request')
var router = express.Router()

module.exports = router

router.get('/launch', function(req, res) {
  if (req.session.gpoc.brand === 'virtually') {
    res.redirect('/primary-care-dispositions/iteration-4-gpoc/booking-virtually-native/001-login');
  } else if (req.session.gpoc.brand === 'econsult') {
    res.send('econsult');
  }
});
