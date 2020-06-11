var express = require('express')
var router = express.Router()

var client = require('../../lib/elasticsearch.js')
var bodymap = require('../../data/bodymap.js')

module.exports = router

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Finding Pathways work - May 2018 ++++++++++++++++++++++++++++++++++++++++++++
// Elasticsearch +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

var indexToUse = 'pathways_inc_alias';

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
    req.session.demographics.dob = {};
    req.session.demographics.dob.day = '23';
    req.session.demographics.dob.month = '5';
    req.session.demographics.dob.year = '1977';
  }
}

router.get('/start', function (req, res) {

  // catch a linked group here - for example COVID-19
  var template = 'finding-pathways/start.html';
  if (typeof req.session.userJourney !== 'undefined') {
    if (req.session.userJourney.route === 'linked') {
      template = req.session.userJourney.linkedTemplate
    }
  }

  setDefaults(req);
  // if there's a query then display results template
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
      index: indexToUse,
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
    // there's no query so render the search page
    res.render(template);
  }
});

// Browse index ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.get('/browse', function(req, res) {
  setDefaults(req);
  res.render('finding-pathways/browse.html');
});

// Browse a-z ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.get('/browse-a-z', function(req, res) {
  setDefaults(req);
  client.search({
    index: indexToUse,
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
router.get('/categories/parts-of-the-body', function(req, res) {
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
    index: indexToUse,
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
router.get('/categories/:category', function(req, res) {
  // req.params: { "category": "accidental-overdose-or-swallowed-an-object" }
  setDefaults(req);
  client.search({
    index: indexToUse,
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
