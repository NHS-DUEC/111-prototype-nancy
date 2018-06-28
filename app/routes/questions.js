var express = require('express')
var fs = require('fs')
var router = express.Router()

module.exports = router

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Creating question journeys from files - June 2018 +++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


var raw = fs.readFileSync('./data/question-sets/stomach-or-side-injury-without-a-cut-or-wound.json');
var questionSet = JSON.parse(raw);

router.get('/:num', function(req, res) {

  var count = parseInt(req.params.num);
  var next = eval(count)+1;
  var prev = eval(count)-1
  if (count === questionSet.questions.length-1) {
    next = questionSet.disposition
  }
  res.render('questions/question.html', {
    question: questionSet.questions[count].question,
    help: questionSet.questions[count].help,
    answers: questionSet.questions[count].answers,
    count: count,
    next: next,
    prev: prev
  });
});
