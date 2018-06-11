var express = require('express')
var router = express.Router()

var client = require('../../lib/elasticsearch.js')
var bodymap = require('../../data/bodymap.js')

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
        general: 'A valid postcode is required to book a phone call',
        postcode: 'Please enter a postcode'
      }
    });
  } else {

    res.redirect('details_2');
  }
})

// Multi-part journey ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Postcode ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.get('/clinical-callback', function (req, res) {
  res.render('clinical-callback/mp-clinical-callback', {
    session: req.session
  });

});

router.post('/clinical-callback/mp-clinical-callback', function (req, res) {

  if (!req.session.homeAddress) {
    req.session.homeAddress = {}
  }

  req.session.homeAddress.postcode = req.body['postcode'];
  req.session.homeAddress.building = req.body['building'];

  if (req.body['postcode'] === '') {
    res.render('clinical-callback/mp-clinical-callback', {
      session: req.session,
      error: {
        general: 'A valid postcode is required to book a phone call',
        postcode: 'Please enter a postcode'
      }
    });
  } else {
    res.redirect('mp-details_who');
  }
})

// Multi-part journey ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Which person +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.post('/clinical-callback/mp-details_who', function (req, res) {

    if (!req.session.pronoun) {
        req.session.pronoun = {}
    }

    if (!req.session.patient) {
        req.session.patient = {
            dob: {}
        }
    }

    if (!req.session.informant) {
        req.session.informant = {}
    }

    if (req.body['check-person'] == "self") {
        //capture pateints name data
        req.session.patient.firstName = req.body['self-first-name'];
        req.session.patient.lastName = req.body['self-last-name'];
        req.session.pronoun = 'your';

        res.redirect('mp-telephone');

        // //check the form is filled correctly
        // if (req.body['self-first-name'] === '' && req.body['self-last-name'] === '') {
        //   res.render('clinical-callback/mp-details_who', {
        //     session: req.session,
        //     error: {
        //       general: 'Please enter a name'
        //     }
        //   });
        // } else {
        //   // go to details
        //   res.redirect('mp-details');
        // }

    } else if (req.body['check-person'] == "other"){
        //capture pateints name data
        req.session.patient.firstName = req.body['first-name'];
        req.session.patient.lastName = req.body['last-name'];

        //capture informant data - this details of someone to speak to.
        req.session.informant.firstName = req.body['informant-first-name'];
        req.session.informant.lastName = req.body['informant-last-name'];

        req.session.pronoun = 'their';

        // go to details
        res.redirect('mp-telephone');

    } else {

        res.render('clinical-callback/mp-details_who', {
          session: req.session,
          error: {
            general: 'Please select who the service is for'
          }
        });

      }
})


// Multi-part journey ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// set telephone +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


router.post('/clinical-callback/mp-telephone', function (req, res) {

    if (!req.session.telephoneNumber) {
      req.session.telephoneNumber = {}
    }

    if (!req.session.editElement) {
      req.session.editElement = {}
    }

    req.session.telephoneNumber = req.body['tel-number'];

    if (!req.body['tel-number']) {
      res.render('clinical-callback/mp-telephone', {
          session: req.session,
          error: {
            general: 'A phone number is required to book a call',
            telephone: 'Please enter a phone number',
          }
      });
    } else {

      // check to see if if we are editing an element or not
      switch(req.session.editElement){
        case 'telephone':
          res.redirect('mp-confirm_details_lite');
          break;
        default:
          res.redirect('mp-dob');
      }


    }

  phoneNumberVerificationTest(req);

})

// Multi-part journey ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// set D.O.B. ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.post('/clinical-callback/mp-dob', function (req, res) {

    if (!req.session.patient) {
        req.session.patient = {
            dob: {}
        }
    }

    //capture patient DOB
    req.session.patient.dob.day = req.body['dob-day'];
    req.session.patient.dob.month = req.body['dob-month'];
    req.session.patient.dob.year = req.body['dob-year'];

  if (req.body['dob-day'] === '' || req.body['dob-month'] === '' || req.body['dob-year'] === '') {
    res.render('clinical-callback/mp-dob', {
      session: req.session,
      error: {
        general: 'A date of birth is required to book a phone call',
        dob: 'Please enter a date of birth'
      }
    });
  } else {
    res.redirect('mp-address-lookup');
  }

})


// Multi-part journey +++++++++++++++++++++++++++++++++++++++++++++++++++++++
// set address. ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.post('/clinical-callback/mp-address-lookup', function (req, res) {
    res.redirect('mp-confirm_details_lite');
})

// Multi-part journey +++++++++++++++++++++++++++++++++++++++++++++++++++++++
// change phone number ++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.post('/clinical-callback/mp-confirm_details_lite', function (req, res) {

    if (!req.session.editElement) {
        req.session.editElement = {}
    }

    req.session.editElement = req.body['element'];

    //move to page depending on the element you are editing
    switch(req.session.editElement){
      case 'telephone':
        res.redirect('mp-telephone');
        break;
      default:
        res.redirect('mp-confirm_details_lite'); //redirect to same page
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
	if (!req.body['tel-number']) {
      res.render('clinical-callback/details_2', {
          session: req.session,
          error: {
            general: 'A phone number is required to book a call',
            telephone: 'Please enter a phone number',
          }
      });
    } else {
		setPersonalDetailsSessionData(req);
		phoneNumberVerificationTest(req);
		res.redirect('confirm_details_lite');
	}
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

// phone verifcation test  +++++++++++++++++++++++++++++++++

function phoneNumberVerificationTest(req) {
    if (!req.session.numberVerificationTestPerformed) req.session.telephoneNumber = scramblePhoneNumber(req.session.telephoneNumber);
    req.session.numberVerificationTestPerformed = true;
}

// Scramble +++++++++++++++++++++++++++++++++

function scramblePhoneNumber(number) {
    var chars = number.split("");
    var lastdigit = Number(chars[chars.length - 1]);
    var newLastDigit = 8;
    if (lastdigit < 9) newLastDigit = lastdigit + 1;

    chars[chars.length - 1] = newLastDigit;
    return chars.join("");
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Set personal details +++++++++++++++++++++++++++++++++

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


// Multi-part +++++++++++++++++++++++++++++++++
// set person +++++++++++++++++++++++++++++++++

function setPerson(req){

    if (!req.session.pronoun) {
        req.session.pronoun = {}
    }

    if (!req.session.patient) {
        req.session.patient = {
            dob: {}
        }
    }

    if (!req.session.informant) {
        req.session.informant = {}
    }

    if (req.body['check-person'] == "self") {
        //capture pateints name data
        req.session.patient.firstName = req.body['self-first-name'];
        req.session.patient.lastName = req.body['self-last-name'];
        req.session.pronoun = 'your';
    } else {
        //capture pateints name data
        req.session.patient.firstName = req.body['first-name'];
        req.session.patient.lastName = req.body['last-name'];

        //capture informant data - this details of someone to speak to.
        req.session.informant.firstName = req.body['informant-first-name'];
        req.session.informant.lastName = req.body['informant-last-name'];

        req.session.pronoun = 'their';
    }

}


// Multi-part +++++++++++++++++++++++++++++++++
// set DOB ++++++++++++++++++++++++++++++

function setDOB(req) {

    if (!req.session.patient) {
        req.session.patient = {
            dob: {}
        }
    }

    //capture patient DOB
    req.session.patient.dob.day = req.body['dob-day'];
    req.session.patient.dob.month = req.body['dob-month'];
    req.session.patient.dob.year = req.body['dob-year'];

}


// location - address lookup.
// find location

router.get('/location/', function (req, res) {
  req.session.destroy();
  res.render('index.html');
});


// postcode lookup

router.post('/location/postcode', function (req, res) {

    if (!req.session.postcode) {
         req.session.postcode = req.body['postcode'];
    }

  if (req.body['postcode'] === '') {

      req.session.postcode = '';

      res.render('location/postcode', {
          session: req.session,
          error: {
            general: 'A full valid UK postcode is required',
            postcode: 'Please enter a postcode'
          }

      });
  } else if (req.body['postcode'].length < 4)  {
        res.render('location/postcode', {
          session: req.session,
          error: {
            general: 'A full valid UK postcode is required',
            postcode: 'This is not a correct UK postcode'
          }
      });

    } else {

      res.redirect('/service-list/service-list');
  }

})

// postcode lookup on federated start page.

router.post('/location/federated-start', function (req, res) {

    if (!req.session.postcode) {
         req.session.postcode = req.body['postcode'];
    }

  if (req.body['postcode'] === '') {

      req.session.postcode = '';

      res.render('location/federated-start', {
          session: req.session,
          error: {
            general: 'A full valid UK postcode is required',
            postcode: 'Please enter a postcode'
          }

      });
  } else if (req.body['postcode'].length < 4)  {
        res.render('location/federated-start', {
          session: req.session,
          error: {
            general: 'A full valid UK postcode is required',
            postcode: 'This is not a correct UK postcode'
          }
      });

    } else {
      res.redirect(whichService(req.body['postcode']));

  }

})

router.post('/location/postcode-service', function (req, res) {

    if (!req.session.postcode) {
         req.session.postcode = req.body['postcode'];
    }

  if (req.body['postcode'] === '') {

      req.session.postcode = '';

      res.render('location/federated-start', {
          session: req.session,
          error: {
            general: 'A full valid UK postcode is required',
            postcode: 'Please enter a postcode'
          }

      });
  } else if (req.body['postcode'].length < 4)  {
        res.render('location/federated-start', {
          session: req.session,
          error: {
            general: 'A full valid UK postcode is required',
            postcode: 'This is not a correct UK postcode'
          }
      });

    } else {
      res.redirect('gp-dx');

  }

})

function whichService (enteredPostCode) {

  var returnedObject = '';

  console.log(enteredPostCode);
  enteredPostCode = enteredPostCode.replace(/\s/g, '');
  enteredPostCode = enteredPostCode.toLowerCase();
 console.log(enteredPostCode);
  //decide which url it goes to

  if (enteredPostCode === 'ls15123') {
    var returnedObject = 'service-111-online';
    return returnedObject;
   } else if (enteredPostCode === 'sw1123') {
    var returnedObject = 'service-babylon';
    return returnedObject;
  } else if (enteredPostCode === 'su30123') {
    var returnedObject = 'https://www.111onlinesuffolk.careuk.com/portal/careuk/';
    return returnedObject;
  } else {
    var returnedObject = 'federated-fail';
    return returnedObject;
  }

}


router.post('/location/address-auto-display', function (req, res) {
  res.redirect('service-babylon');
})

router.post('/location/index_man_auto_error', function (req, res) {

    if (!req.session.postcode) {
         req.session.postcode = req.body['postcode'];
    }

    if (req.body['postcode'] === '') {

        req.session.postcode = '';

        res.render('location/index', {
            session: req.session,
            error: {
              general: 'A full valid UK postcode is required',
              postcode: 'Please enter a postcode'
            }

        });
    } else if (req.body['postcode'].length < 4)  {
          res.render('location/index', {
            session: req.session,
            error: {
              general: 'A full valid UK postcode is required',
              postcode: 'This is not a correct UK postcode'
            }
        });

      } else {
        res.redirect('/service-list/service-list');
    }

})


// Hard interrupt +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.post('/emergency-feedback/hard-interrupt--question-1', function(req, res) {
  if (req.body['answer'] === 'yes') {
    res.redirect('/emergency-feedback/hard-interrupt--interrupt');
  } else {
    res.send('another question');
  }
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Finding Pathways work - May 2018 ++++++++++++++++++++++++++++++++++++++++++++
// Elasticsearch +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

/*
router.get('/finding-pathways/start', function (req, res) {
  if (req.query.query) {
    var query = req.query.query;
    var queryString = '';
    // split the string and check for body keywords
    query
      .split(' ')
      .forEach(function (val, index, array) {
        if (bodymap.indexOf(val) !== -1) {
          val += "^5"
        }
        queryString += val + ' ';
      });

    queryObj = {
      "query_string" : {
        "fields" : ["bodymap", "DigitalDescription", "DigitalTitles", "CommonTerms"],
        "query" : queryString
      }
    }

    client.search({
      index: 'pathways_truncated',
      body: {
        from: 0,
        size: 120,
        query: queryObj,
        highlight: {
          pre_tags: ['<span class="highlighter">'],
          post_tags: ['</span>'],
          number_of_fragments: 0,
          fields: {
            DigitalTitles: {},
            DigitalDescription: {}
          }
        }
      }
    }, function (error,response,status) {
        if (error){
          res.send("search error: "+error);
        } else {
          if (response.hits.hits.length >= 1) {
            res.render('finding-pathways/results.html', {
              'elasticQuery': queryObj,
              'results': response.hits.hits,
              'query': query
            });
          } else {
            res.render('finding-pathways/no-results.html', {
              'query': query
            });
          }
        }
    });
  } else {
    res.render('finding-pathways/start.html');
  }
});
*/

router.get('/finding-pathways/start', function (req, res) {
  if (req.query.query) {
    var query = req.query.query;
    var minShould = '';
    // split the string and check for body keywords
    query
      .split(' ')
      .forEach(function (val, index, array) {
        if (bodymap.indexOf(val) !== -1) {
          minShould += val + " "
        }
      });

    if (minShould === '') {
      queryObj = {
        bool: {
          should: [
            {match: { DigitalDescription: query }},
            {match: { DigitalTitles: query }},
            {match: { CommonTerms: query }},
            {match: { bodymap: query }}
          ]
        }
      }
    } else {
      queryObj = {
        bool: {
          must: {
            match: {
              bodymap: minShould
            }
          },
          should: [
            {match: { DigitalDescription: query }},
            {match: { DigitalTitles: query }},
            {match: { CommonTerms: query }},
            {match: { bodymap: query }}
          ],
        }
      }
    }

    client.search({
      index: 'pathways_truncated',
      body: {
        from: 0,
        size: 120,
        query: queryObj,
        highlight: {
          pre_tags: ['<span class="highlighter">'],
          post_tags: ['</span>'],
          number_of_fragments: 0,
          fields: {
            DigitalTitles: {},
            DigitalDescription: {}
          }
        }
      }
    }, function (error,response,status) {
        if (error){
          res.send("search error: "+error);
        } else {
          if (response.hits.hits.length >= 1) {
            res.render('finding-pathways/results.html', {
              'elasticQuery': queryObj,
              'results': response.hits.hits,
              'query': query
            });
          } else {
            res.render('finding-pathways/no-results.html', {
              'query': query
            });
          }
        }
    });
  } else {
    res.render('finding-pathways/start.html');
  }
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Book a call - June 2018 +++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.get('/999-disposition/book-call-start', function(req, res) {
  // zero out a namespaced session obj
  req.session.callBooking = {};
  res.render('999-disposition/book-call-start');
});

router.post('/999-disposition/book-call-demographics', function(req, res) {
  if (req.body['name'] === '') {

  }
});

router.post('/999-disposition/book-call-confirm-location', function (req, res) {
  if (req.body['locationConfirmed'] === 'yes') {
    res.redirect('book-call-check-your-answers');
  } else {
    res.redirect('book-call-change-location');
  }
});
