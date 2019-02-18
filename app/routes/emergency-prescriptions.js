var express = require('express')
var moment = require('moment-timezone')
var router = express.Router()

module.exports = router

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Emergency Prescriptions - Feb 2019 ++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.get('/', function(req,res,next) {
  if (!req.session.demographics) {
    // zero out a namespaced session obj with defaults
    req.session.demographics = {};
    req.session.demographics.sex = 'Male';
    req.session.demographics.age = '40';
    req.session.demographics.ageCategory = 'Adult';
  }
  next()
})

// -----------------------------------------------------------------------------

router.get('/feel-unwell', function(req,res) {
  res.render('emergency-prescriptions/question', {
    question: "Do you also feel unwell?",
    answers: [
      {
        text: "Yes",
        route: "/finding-pathways/start"
      },
      {
        text: "No",
        route: "/emergency-prescriptions/next-dose"
      }
    ]
  })
})

// -----------------------------------------------------------------------------

router.get('/next-dose/:dose', function(req,res) {
  if (!req.session.emergencyprescriptions) req.session.emergencyprescriptions = {}
  req.session.emergencyprescriptions.dose = req.params.dose
  res.redirect('/emergency-prescriptions/run-out')
})

router.get('/next-dose/', function(req,res) {
  res.render('emergency-prescriptions/question', {
    question: "When is your next dose due?",
    answers: [
      {
        text: "I've already missed a dose",
        route: "/emergency-prescriptions/next-dose/missed"
      },
      {
        text: "In less than 2 hours",
        route: "/emergency-prescriptions/next-dose/2-hours"
      },
      {
        text: "Between 2 and 6 hours",
        route: "/emergency-prescriptions/next-dose/2-6-hours"
      },
      {
        text: "Between 6 and 12 hours",
        route: "/emergency-prescriptions/next-dose/6-12-hours"
      },
      {
        text: "More than 12 hours",
        route: "/emergency-prescriptions/next-dose/12-plus-hours"
      },
      {
        text: "I don't know",
        route: "/emergency-prescriptions/next-dose/dont-know"
      }
    ]
  })
})

// -----------------------------------------------------------------------------

router.get('/run-out/', function(req,res) {
  res.render('emergency-prescriptions/question', {
    question: "What medicine have you run out of?",
    answers: [
      {
        text: "My regular prescription",
        route: "/emergency-prescriptions/select-medicines"
      },
      {
        text: "Something I've had before and stopped taking",
        route: "/start/"
      }
    ]
  })
})

// -----------------------------------------------------------------------------

router.post('/select-medicines/', function(req,res) {
  if (!req.session.emergencyprescriptions) req.session.emergencyprescriptions = {}
  if (!req.session.emergencyprescriptions.medicines) req.session.emergencyprescriptions.medicines = []
  if (req.body.medicine && req.session.emergencyprescriptions.medicines.indexOf(req.body.medicine) == -1) {
    req.session.emergencyprescriptions.medicines.push(req.body.medicine.toLowerCase())
  }

  res.redirect('/emergency-prescriptions/select-medicines')
})

router.get('/select-medicines/remove/:medicine', function(req,res) {
  if (!req.session.emergencyprescriptions) req.session.emergencyprescriptions = {}
  if (!req.session.emergencyprescriptions.medicines) req.session.emergencyprescriptions.medicines = []
  var medicineIndex = req.session.emergencyprescriptions.medicines.indexOf(req.params.medicine) 
  var medicines = req.session.emergencyprescriptions.medicines

  if (medicineIndex >= 0) {
    req.session.emergencyprescriptions.medicines = medicines.slice(0,medicineIndex).concat(medicines.slice(medicineIndex+1))
  }

  res.redirect('/emergency-prescriptions/select-medicines')
})

// -----------------------------------------------------------------------------

router.get('/why-need/:reason', function(req,res) {
  if (!req.session.emergencyprescriptions) req.session.emergencyprescriptions = {}
  req.session.emergencyprescriptions.reason = req.params.reason
  res.redirect('/emergency-prescriptions/recommended-service')
})

router.get('/why-need/', function(req,res) {
  res.render('emergency-prescriptions/question', {
    question: "Why do you need an emergency prescription?",
    answers: [
      {
        text: "I've not ordered my prescription",
        route: "/emergency-prescriptions/why-need/not-ordered"
      },
      {
        text: "My prescription is not ready",
        route: "/emergency-prescriptions/why-need/not-ready"
      },
      {
        text: "I'm away from home and don't have any",
        route: "/emergency-prescriptions/why-need/away"
      },
      {
        text: "I've lost my prescription or medicine",
        route: "/emergency-prescriptions/why-need/lost"
      },
      {
        text: "Any other reason",
        route: "/emergency-prescriptions/why-need/other-reason"
      }
    ]
  })
})


// -----------------------------------------------------------------------------

router.post('/name', function(req, res) {
  if (!req.session.emergencyprescriptions) req.session.emergencyprescriptions = {}
  req.session.emergencyprescriptions.fullname = req.body.fullname

  res.redirect('/emergency-prescriptions/email')
})

// -----------------------------------------------------------------------------

router.post('/email', function(req, res) {
  if (!req.session.emergencyprescriptions) req.session.emergencyprescriptions = {}
  req.session.emergencyprescriptions.email = req.body.email

  res.redirect('/emergency-prescriptions/phone')
})

// -----------------------------------------------------------------------------

router.post('/phone', function(req, res) {
  if (!req.session.emergencyprescriptions) req.session.emergencyprescriptions = {}
  req.session.emergencyprescriptions.phone = req.body.phone

  res.redirect('/emergency-prescriptions/confirmation')
})

// -----------------------------------------------------------------------------

router.post('/question-handler', function(req, res) {
  var nextQuestion = JSON.parse(req.body.answers)[req.body.answer].route;
  res.redirect(nextQuestion);
});

// -----------------------------------------------------------------------------

