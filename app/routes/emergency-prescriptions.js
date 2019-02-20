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
  req.session.emergencyprescriptions = {}
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
        route: "/emergency-prescriptions/why-need"
      }
    ]
  })
})

// -----------------------------------------------------------------------------

router.get('/why-need/:reason', function(req,res) {
  if (!req.session.emergencyprescriptions) req.session.emergencyprescriptions = {}
  req.session.emergencyprescriptions.reason = req.params.reason
  res.redirect('/emergency-prescriptions/run-out')
})

router.get('/why-need/', function(req,res) {
  if (req.session.emergencyprescriptions.phone) return res.redirect('/emergency-prescriptions/confirmation')

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

router.get('/run-out/', function(req,res) {
  res.render('emergency-prescriptions/question', {
    question: "What have you run out of?",
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
  var medicines = req.body.medicine.split(",")
  medicines.forEach(medicine => {
    medicine = medicine.toLowerCase()
    if (medicine.trim() !== "" && req.session.emergencyprescriptions.medicines.indexOf(medicine) == -1) {
      req.session.emergencyprescriptions.medicines.push(medicine)
    }
  })

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

router.get('/next-due/:dose', function(req,res) {
  if (!req.session.emergencyprescriptions) req.session.emergencyprescriptions = {}
  req.session.emergencyprescriptions.dose = req.params.dose
  res.redirect('/emergency-prescriptions/recommended-service')
})

router.get('/next-due/', function(req,res) {
  res.render('emergency-prescriptions/question', {
    question: "When is it next due?",
    answers: [
      {
        text: "It's already late",
        route: "/emergency-prescriptions/next-due/missed"
      },
      {
        text: "In less than 2 hours",
        route: "/emergency-prescriptions/next-due/2-hours"
      },
      {
        text: "In 2 to 6 hours",
        route: "/emergency-prescriptions/next-due/2-6-hours"
      },
      {
        text: "In 6 to 12 hours",
        route: "/emergency-prescriptions/next-due/6-12-hours"
      },
      {
        text: "More than 12 hours",
        route: "/emergency-prescriptions/next-due/12-plus-hours"
      },
      {
        text: "I don't know",
        route: "/emergency-prescriptions/next-due/dont-know"
      }
    ]
  })
})

// -----------------------------------------------------------------------------

router.get('/details', function(req,res,next) {
  if (!req.session.emergencyprescriptions) req.session.emergencyprescriptions = {}
  if (req.session.emergencyprescriptions.phone) return res.redirect('/emergency-prescriptions/confirmation')
  else next()
})

// -----------------------------------------------------------------------------

router.post('/name', function(req, res) {
  if (!req.session.emergencyprescriptions) req.session.emergencyprescriptions = {}
  req.session.emergencyprescriptions.firstname = req.body.firstname
  req.session.emergencyprescriptions.lastname = req.body.lastname

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

