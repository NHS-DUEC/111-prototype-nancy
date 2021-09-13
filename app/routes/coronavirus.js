var express = require('express')
var request = require('request')
var router = express.Router()

module.exports = router

router.post('/phase-1/question-worried-generally', function(req, res) {
  res.redirect('/coronavirus/phase-1/question-specific-place');
});

router.post('/phase-1/question-specific-place', function(req, res) {
  res.redirect('/coronavirus/phase-1/question-country');
});

router.post('/phase-1/question-country', function(req, res) {
  res.redirect('/coronavirus/phase-1/question-contact');
});

router.post('/phase-1/question-contact', function(req, res) {
  res.redirect('/coronavirus/phase-1/question-symptom');
});

router.post('/phase-1/question-symptom', function(req, res) {
  res.redirect('/coronavirus/phase-1/outcome-isolate-111');
});
