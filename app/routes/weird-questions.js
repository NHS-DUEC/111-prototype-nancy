var express = require('express')
var router = express.Router()
var hijacks = require('../../data/question-sets/hijacks.js')

module.exports = router

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Wire up 'weird questions' - June 2018 +++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.get('/', function(req, res) {

  if (req.query['pw'] == "EMERGENCYPRESCRIPTION") {
    return res.redirect("/emergency-prescription/")
  }

  // "Adult" is 16+
  // Set a default here
  // Male
  // Adult (40)
  if (!req.session.demographics) {
    // zero out a namespaced session obj with defaults
    req.session.demographics = {};
    req.session.demographics.sex = 'Male';
    req.session.demographics.age = '40';
    req.session.demographics.ageCategory = 'Adult';
  }
  var pathway = '1346';
  if (req.query['pw']) {
    pathway = req.query['pw'];
  }
  res.render('weird-questions/index', {
    pw: pathway,
    sex: req.session.demographics.sex,
    age: req.session.demographics.age,
    hijacks: hijacks
  });
});
