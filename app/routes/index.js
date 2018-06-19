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
// Wire up 'weird questions' - June 2018 +++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.get('/weird-questions', function(req, res) {
  var pathway = '1346';
  if (req.query['pw']) {
    pathway = req.query['pw'];
  }
  var s = 'Male';
  if (req.session.demographics.sex) {
    s = req.session.demographics.sex;
  }
  var a = '40';
  if (req.session.demographics.age) {
    a = req.session.demographics.age;
  }
  res.render('weird-questions/index', {
    pw: pathway,
    sex: s,
    age: a
  });
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Joined up journey - June 2018 +++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.post('/gateway/demographics', function(req, res) {
  // "Adult" is 16+
  // Set a default here if there's a lack of req.query
  // Male
  // Adult (40)
  if (!req.session.demographics) {
    // zero out a namespaced session obj with defaults
    req.session.demographics = {};
    req.session.demographics.sex = 'Male';
    req.session.demographics.age = '40';
    req.session.demographics.ageCategory = 'Adult';
  }
  if (req.body['age'] !== '') {
    var age = Number(req.body['age']);
    var ageCategory = 'Adult';
    if (age < 16) {
      ageCategory = 'Child';
    }
    req.session.demographics.age = age;
    req.session.demographics.ageCategory = ageCategory;
  }
  if (req.body['sex']) {
    req.session.demographics.sex = req.body['sex'];
  }
  res.redirect('/finding-pathways/start');
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
        size: 10,
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

var setDefaults = function(req) {
  // "Adult" is 16+
  // Set a default here if there's a lack of req.query
  // Male
  // Adult (40)
  if (!req.session.demographics) {
    // zero out a namespaced session obj with defaults
    req.session.demographics = {};
    req.session.demographics.sex = 'Male';
    req.session.demographics.age = '40';
    req.session.demographics.ageCategory = 'Adult';
  }
}

router.get('/finding-pathways/start', function (req, res) {
  setDefaults(req);
  if (req.query['query']) {
    var query = req.query['query'];
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
          must: [
            {match: { PW_Age: req.session.demographics.ageCategory }},
            {match: { PW_Gender: req.session.demographics.sex }}
          ],
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
          must: [
            {match: { bodymap: minShould }},
            {match: { PW_Age: req.session.demographics.ageCategory }},
            {match: { PW_Gender: req.session.demographics.sex }}
          ],
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
      //index: 'pathways_truncated',
      index: 'pathways_full',
      body: {
        from: 0,
        size: 10,
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
              'query': query,
              'session': req.session
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

// Browse index ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.get('/finding-pathways/browse', function(req, res) {
  setDefaults(req);
  res.render('finding-pathways/browse.html');
});

// Browse a-z ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.get('/finding-pathways/browse-a-z', function(req, res) {
  setDefaults(req);
  client.search({
    //index: 'pathways_truncated',
    index: 'pathways_full',
    body: {
      from: 0,
      size: 200,
      query: {
        bool: {
          must: [
            {match: { PW_Age: req.session.demographics.ageCategory }},
            {match: { PW_Gender: req.session.demographics.sex }}
          ]
        }
      },
      sort: 'DigitalTitles.keyword'
    }
  }, function (error,response,status) {
      if (error){
        res.send("search error: "+error);
      } else {
        res.render('finding-pathways/browse-a-z.html', {
          'results': response.hits.hits
        });
      }
  });
});

// Browse parts of the body ++++++++++++++++++++++++++++++++++++++++++++++++++++
router.get('/finding-pathways/categories/parts-of-the-body', function(req, res) {
  setDefaults(req);

  var head_hair_and_face = [];
  var ears = [];
  var eyes = [];
  var nose = [];
  var jaw_mouth_and_teeth = [];
  var neck_and_throat = [];
  var shoulders_and_arms = [];
  var wrists_hands_and_fingers = [];
  var chest_and_upper_back = [];
  var stomach_and_sides = [];
  var lower_back = [];
  var groin_and_genitals = [];
  var bottom = [];
  var hips_legs_and_feet = [];

  client.search({
    //index: 'pathways_truncated',
    index: 'pathways_full',
    body: {
      from: 0,
      size: 200,
      query: {
        bool: {
          must: [
            {match: { PW_Age: req.session.demographics.ageCategory }},
            {match: { PW_Gender: req.session.demographics.sex }},
            {match: { categories: 'parts-of-the-body' }}
          ]
        }
      },
      sort: 'DigitalTitles.keyword'
    }
  }, function (error,response,status) {
      if (error){
        res.send("search error: "+error);
      } else {
        response.hits.hits.forEach(function(hit) {
          if (hit._source.categories.indexOf('head-hair-and-face') !== -1) {
            head_hair_and_face.push(hit);
          }
          if (hit._source.categories.indexOf('ears') !== -1) {
            ears.push(hit);
          }
          if (hit._source.categories.indexOf('eyes') !== -1) {
            eyes.push(hit);
          }
          if (hit._source.categories.indexOf('nose') !== -1) {
            nose.push(hit);
          }
          if (hit._source.categories.indexOf('jaw-mouth-and-teeth') !== -1) {
            jaw_mouth_and_teeth.push(hit);
          }
          if (hit._source.categories.indexOf('neck-and-throat') !== -1) {
            neck_and_throat.push(hit);
          }
          if (hit._source.categories.indexOf('shoulders-and-arms') !== -1) {
            shoulders_and_arms.push(hit);
          }
          if (hit._source.categories.indexOf('wrists-hands-and-fingers') !== -1) {
            wrists_hands_and_fingers.push(hit);
          }
          if (hit._source.categories.indexOf('chest-and-upper-back') !== -1) {
            chest_and_upper_back.push(hit);
          }
          if (hit._source.categories.indexOf('stomach-and-sides') !== -1) {
            stomach_and_sides.push(hit);
          }
          if (hit._source.categories.indexOf('lower-back') !== -1) {
            lower_back.push(hit);
          }
          if (hit._source.categories.indexOf('groin-and-genitals') !== -1) {
            groin_and_genitals.push(hit);
          }
          if (hit._source.categories.indexOf('bottom') !== -1) {
            bottom.push(hit);
          }
          if (hit._source.categories.indexOf('hips-legs-and-feet') !== -1) {
            hips_legs_and_feet.push(hit);
          }
        });
        res.render('finding-pathways/browse-body.html', {
          'head_hair_and_face': head_hair_and_face,
          'ears': ears,
          'eyes': eyes,
          'nose': nose,
          'jaw_mouth_and_teeth': jaw_mouth_and_teeth,
          'neck_and_throat': neck_and_throat,
          'shoulders_and_arms': shoulders_and_arms,
          'wrists_hands_and_fingers': wrists_hands_and_fingers,
          'chest_and_upper_back': chest_and_upper_back,
          'stomach_and_sides': stomach_and_sides,
          'lower_back': lower_back,
          'groin_and_genitals': groin_and_genitals,
          'bottom': bottom,
          'hips_legs_and_feet': hips_legs_and_feet
        });
      }
  });
});

// Browse category +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.get('/finding-pathways/categories/:category', function(req, res) {
  // req.params: { "category": "accidental-overdose-or-swallowed-an-object" }
  setDefaults(req);
  client.search({
    //index: 'pathways_truncated',
    index: 'pathways_full',
    body: {
      from: 0,
      size: 200,
      query: {
        bool: {
          must: [
            {match: { PW_Age: req.session.demographics.ageCategory }},
            {match: { PW_Gender: req.session.demographics.sex }},
            {match: { categories: req.params['category'] }}
          ]
        }
      },
      sort: 'DigitalTitles.keyword'
    }
  }, function (error,response,status) {
      if (error){
        res.send("search error: "+error);
      } else {
        res.render('finding-pathways/browse-category.html', {
          'category': req.params['category'],
          'results': response.hits.hits
        });
      }
  });
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Book a call - June 2018 +++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Simple journey - telephone required
router.post('/999-disposition/book-call-min', function(req, res) {
  if (req.body['tel'] === '') {
    res.render('999-disposition/book-call-min', {
      error: {
        general: '<a href="#tel">We need a valid number to call</a>',
        tel: 'Enter a valid number'
      }
    });
  } else {
    res.redirect('call-booked');
  }
});

// PDS journey - some demographics requested
router.get('/999-disposition/book-call-demographics', function(req, res) {
  if (!req.session.callBooking) {
    // zero out a namespaced session obj
    req.session.callBooking = {};
    req.session.callBooking.name = '';
    req.session.callBooking.dob = {};
    req.session.callBooking.postcode = '';
    req.session.callBooking.tel = '';
  }
  res.render('999-disposition/book-call-demographics');
});

router.post('/999-disposition/book-call-demographics', function(req, res) {
  req.session.callBooking.name = req.body['name'];
  req.session.callBooking.dob.day = req.body['dob-day'];
  req.session.callBooking.dob.month = req.body['dob-month'];
  req.session.callBooking.dob.year = req.body['dob-year'];
  req.session.callBooking.postcode = req.body['postcode'];
  res.redirect('book-call-number');
});

router.post('/999-disposition/book-call-number', function(req, res) {
  if (req.body['tel'] === '') {
    res.render('999-disposition/book-call-number', {
      error: {
        general: '<a href="#tel">We need a valid number to call</a>',
        tel: 'Enter a valid number'
      }
    });
  } else {
    req.session.callBooking.tel = req.body['tel'];
    res.redirect('book-call-check-your-answers');
  }
});

router.get('/999-disposition/call-booked', function(req, res) {
  // zero out a namespaced session obj
  req.session.callBooking = {};
  res.render('999-disposition/call-booked');
});

// "lead with callback" scenario
router.post('/999-disposition/disposition-callback-first-001', function(req, res) {
  if (req.body['revisitQuestion'] === 'yes') {
    res.redirect('/999-disposition/question?from=disposition-callback-first-001');
  } else {
    res.redirect('/999-disposition/disposition-callback-first-002');
  }
});

router.post('/999-disposition/disposition-callback-first-002', function(req, res) {
  if (req.body['tel'] === '') {
    res.render('999-disposition/disposition-callback-first-002', {
      error: {
        general: '<a href="#tel">We need a valid number to call</a>',
        tel: 'Enter a valid number'
      }
    });
  } else {
    res.redirect('call-booked');
  }
});

// handling 'back' links from multiple routes in
router.get('/999-disposition/options', function(req, res) {
  var backUrl = req.query['from'];
  res.render('999-disposition/options', {
    back: backUrl
  });
});

router.get('/999-disposition/question', function(req, res) {
  var backUrl = req.query['from'];
  res.render('999-disposition/question', {
    back: backUrl
  });
});

router.get('/999-disposition/book-call-min', function(req, res) {
  var backUrl = req.query['from'];
  res.render('999-disposition/book-call-min', {
    back: backUrl
  });
});
