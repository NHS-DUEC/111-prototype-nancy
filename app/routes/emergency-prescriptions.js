var express = require('express')
var moment = require('moment-timezone')
var router = express.Router()

module.exports = router

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Emergency Prescriptions - Feb 2019 ++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.get('/', function(req,res) {
  if (!req.session.demographics) {
    // zero out a namespaced session obj with defaults
    req.session.demographics = {};
    req.session.demographics.sex = 'Male';
    req.session.demographics.age = '40';
    req.session.demographics.ageCategory = 'Adult';
  }
})

// -----------------------------------------------------------------------------

router.get('/felt-unwell', function(req,res) {
  res.render('emergency-prescriptions/question', {
    question: "Have you also started to feel unwell?",
    answers: [
      {
        text: "No",
        route: "/emergency-prescriptions/select-medications"
      },
      {
        text: "Yes",
        route: "/finding-pathways/start"
      }
    ]
  })
})

// -----------------------------------------------------------------------------

router.post('/question-handler', function(req, res) {
  var nextQuestion = JSON.parse(req.body.answers)[req.body.answer].route;
  res.redirect(nextQuestion);
});

// -----------------------------------------------------------------------------

