var express = require('express')
var router = express.Router()

module.exports = router

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Offer a callback as a choice - July 2018 ++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Journey #1 - comparison
router.get('/linear', function(req, res) {
  res.send('path: /callback-offered/linear');
});

// Journey #2 - linear y/n
router.get('/comparison', function(req, res) {
  res.send('path: /callback-offered/comparison');
});
