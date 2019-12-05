var express = require('express')
var request = require('request')
var router = express.Router()

module.exports = router

router.get('/', function(req, res) {
  /*
  // what's forward and back for this for the journey?
  req.session.gplookup.backUrl = req.body['backUrl'];
  req.session.gplookup.onwardUrl = req.body['onwardUrl'];
  */
  res.render('gp-lookup/index.html');
});

router.post('/', function(req, res) {
  if (req.body['gp-registered'] === 'yes') {
    if (req.session.disposition) {
      // you're in the GPOC journey demo pal:
      res.redirect('/gp-lookup/gp-pre-lookup-listing');
    } else {
      res.redirect('/gp-lookup/gp-lookup');
    }
  } else if (req.body['gp-registered'] === 'no') {
    res.send("No");
  } else if (req.body['gp-registered'] === 'unknown') {
    res.send("Unknown");
  } else {
    res.render('gp-lookup/index.html', {
      error : true
    });
  }
});

router.post('/gp-lookup', function(req, res) {
  // zero out a namespaced session obj
  req.session.usersGP = {};
  req.session.usersGP.name = {};
  req.session.usersGP.address = {};
  // add what's been sent across to the session
  req.session.usersGP.name = req.body['practice-name'];
  req.session.usersGP.address = req.body['practice-address'];
  if (req.session.disposition) {
    res.redirect('/primary-care-dispositions/iteration-4-gpoc/handover-appt-type');
  } else {
    res.send("posted" + req.body['practice-name']);
  }
});
