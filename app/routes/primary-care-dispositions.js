var express = require('express')
var request = require('request')
var router = express.Router()

module.exports = router

router.get('/gpoc-init', function(req, res) {
  // build out a namespaced session obj
  req.session.gpoc = req.query;
  res.redirect('/user-journeys/scenario-003-primary-care');
});

router.post('/handover-launcher', function(req, res) {
  if (req.body['appt-type'] === 'online-consultation') {
    res.redirect('/primary-care-dispositions/iteration-4-gpoc/handover-launcher');
  } else if (req.body['appt-type'] === 'physical-appointment') {
    res.send("GPSOC");
  } else if (req.body['appt-type'] === 'no') {
    res.send("Change channel");
  } else {
    res.render('primary-care-dispositions/iteration-4-gpoc/handover-appt-type.html', {
      error : true
    });
  }
});
