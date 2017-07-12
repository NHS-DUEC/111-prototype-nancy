var express = require('express')
var router = express.Router()

router.get('/', function (req, res) {
  req.session.destroy();
  res.render('index.html');
});

module.exports = router

// Postcode ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.get('/clinical-callback', function (req, res) {
  res.render('clinical-callback/clinical-callback', {
    session: req.session
  });

});

router.post('/clinical-callback/clinical-callback', function (req, res) {

  if (!req.session.homeAddress) {
    req.session.homeAddress = {}
  }

  req.session.homeAddress.postcode = req.body['postcode'];
  req.session.homeAddress.building = req.body['building'];

  if (req.body['postcode'] === '') {
    res.render('clinical-callback/clinical-callback', {
      session: req.session,
      error: {
        postcode: 'Please enter your postcode'
      }
    });
  } else {
    
    res.redirect('details_2');
  }
})
// Check person +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.post('/clinical-callback/check-person', function (req, res) {
  res.render('clinical-callback/details_2', {
    session: req.session
  });
})

// Contact details - single page contact form +++++++++++++++++++++++++++++++++

router.get('/clinical-callback/details_2', function (req, res) {
  res.render('clinical-callback/details_2', {
        session: req.session
  });

});

router.post('/clinical-callback/details_2', function (req, res) {
    setPersonalDetailsSessionData(req);
    phoneNumberVerificationTest(req);
    res.redirect('confirm_details_lite');
})

// Home address manual +++++++++++++++++++++++++++++++++



router.post('/clinical-callback/home-address-manual', function (req, res) {

    if (!req.session.homeAddress) {
    req.session.homeAddress = {}
  }

  req.session.homeAddress.address = [
    req.body['address-1'],
    req.body['address-2'],
    req.body['address-3'],
    req.body['address-4']
  ];
  req.session.homeAddress.postcode = req.body['postcode'];

  if (!req.body['address-1'] && !req.body['address-4']) {
    res.render('clinical-callback/home-address-manual', {
      error: 'Please enter your full address'
    });
  } else {
    res.redirect('details_2');
  }
  
})

function phoneNumberVerificationTest(req) {
    if (!req.session.numberVerificationTestPerformed) req.session.telephoneNumber = scramblePhoneNumber(req.session.telephoneNumber);
    req.session.numberVerificationTestPerformed = true;
}

function scramblePhoneNumber(number) {
    var chars = number.split("");
    var lastdigit = Number(chars[chars.length - 1]);
    var newlastDigit = lastdigit;
    while (newlastDigit == lastdigit) {
        newlastDigit = getRandomInt(0, 10);
    }
    chars[chars.length - 1] = newlastDigit;
    return chars.join("");
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setPersonalDetailsSessionData(req) {
    if (!req.session.homeAddress) {
        req.session.homeAddress = {}
    }
    
    if (!req.session.patient) {
        req.session.patient = {
            dob: {}
        }
    }
    
    if (!req.session.informant) {
        req.session.informant = {}
    }

    req.session.homeAddress.address = [
        req.body['address-1'],
        req.body['address-2'],
        req.body['address-3'],
        req.body['address-4']
    ];
    if (req.body['check-person'] == "self") {
        req.session.patient.firstName = req.body['self-first-name'];
        req.session.patient.lastName = req.body['self-last-name'];
    } else {
        req.session.patient.firstName = req.body['first-name'];
        req.session.patient.lastName = req.body['last-name'];
    }
    req.session.homeAddress.postcode = req.body['postcode'];
    req.session.telephoneNumber = req.body['tel-number'];

    req.session.informant.firstName = req.body['informant-first-name'];
    req.session.informant.lastName = req.body['informant-last-name'];
    req.session.checkPerson = req.body['check-person'];

    req.session.patient.dob.day = req.body['dob-day'];
    req.session.patient.dob.month = req.body['dob-month'];
    req.session.patient.dob.year = req.body['dob-year'];
}
