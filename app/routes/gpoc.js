var express = require('express')
var request = require('request')
var router = express.Router()

module.exports = router

router.get('/launch', function(req, res) {
  var str = req.session.gpoc.brand;
  res.send(str);
});
