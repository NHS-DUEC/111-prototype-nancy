module.exports =  {
  "id": "corona",
  "viewports": [
    {
      "label": "small",
      "width": 411,
      "height": 731
    }
  ],
  "onBeforeScript": "puppet/onBefore.js",
  "onReadyScript": "puppet/onReady.js",
  "scenarios": [
    {
      "label": "Banner",
      "url": "http://localhost:3000/coronavirus/phase-1/banner",
      "selectors": ["document"]
    },
    {
      "label": "Start",
      "url": "http://localhost:3000/coronavirus/phase-1/start",
      "selectors": ["document"]
    },
    {
      "label": "Question 1",
      "url": "http://localhost:3000/coronavirus/phase-1/question-country",
      "selectors": ["document"]
    },
    {
      "label": "Question 2",
      "url": "http://localhost:3000/coronavirus/phase-1/question-specific-place",
      "selectors": ["document"]
    },
    {
      "label": "Question 3",
      "url": "http://localhost:3000/coronavirus/phase-1/question-country-2",
      "selectors": ["document"]
    },
    {
      "label": "Question 4",
      "url": "http://localhost:3000/coronavirus/phase-1/question-contact",
      "selectors": ["document"]
    },
    {
      "label": "Question 5",
      "url": "http://localhost:3000/coronavirus/phase-1/question-symptom",
      "selectors": ["document"]
    },
    {
      "label": "Outcome: isolate with symptoms",
      "url": "http://localhost:3000/coronavirus/phase-1/outcome-isolate-111-symptoms",
      "selectors": ["document"]
    },
    {
      "label": "Outcome: isolate asymptomatic",
      "url": "http://localhost:3000/coronavirus/phase-1/outcome-isolate-no-symptoms",
      "selectors": ["document"]
    },
    {
      "label": "Outcome: information only (with other symptoms)",
      "url": "http://localhost:3000/coronavirus/phase-1/outcome-info-symptoms",
      "selectors": ["document"]
    },
    {
      "label": "Outcome: information only",
      "url": "http://localhost:3000/coronavirus/phase-1/outcome-info-only",
      "selectors": ["document"]
    }
  ],
  "paths": {
    "bitmaps_reference": "backstop_data/bitmaps_reference",
    "bitmaps_test": "backstop_data/bitmaps_test",
    "engine_scripts": "backstop_data/engine_scripts",
    "html_report": "backstop_data/html_report",
    "ci_report": "backstop_data/ci_report"
  },
  "report": ["browser"],
  "engine": "puppeteer",
  "engineOptions": {
    "args": ["--no-sandbox"]
  },
  "asyncCaptureLimit": 5,
  "asyncCompareLimit": 50,
  "debug": false,
  "debugWindow": false
};
