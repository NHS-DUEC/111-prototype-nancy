var express = require('express')
var fs = require('fs')
var router = express.Router()

module.exports = router

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Creating question journeys from files - June 2018 +++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


var raw = fs.readFileSync('./data/question-sets/stomach-or-side-injury-without-a-cut-or-wound.json');
var questionSet = JSON.parse(raw);

router.get('/', function(req, res) {
  res.redirect('/questions/0');
});

router.get('/:num', function(req, res) {

  var count = parseInt(req.params.num);

  if (!req.session.disposition) {
    // zero out a namespaced session obj
    req.session.disposition = {};
  }

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

router.post('/question-handler', function(req, res) {
  var nextQuestion = req.body.next;
  req.session.disposition.question = req.body.question;
  req.session.disposition.answer = req.body.answer;
  res.redirect(nextQuestion);
});
