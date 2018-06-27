var express = require('express')
var router = express.Router()

module.exports = router

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Joined up journey - June 2018 +++++++++++++++++++++++++++++++++++++++++++++++
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
  }
  if (req.body['age'] !== '') {
    var age = Number(req.body['age']);
    var ageCategory = 'Adult';
    if (age < 16) {
      ageCategory = 'Child';
    }
    req.session.demographics.age = age;
    req.session.demographics.ageCategory = ageCategory;
  }
  if (req.body['sex']) {
    req.session.demographics.sex = req.body['sex'];
  }
  res.redirect('/finding-pathways/start');
});
