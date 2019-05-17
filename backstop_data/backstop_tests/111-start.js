module.exports =  {
  "id": "backstop_default",
  "viewports": [
    {
      "label": "small",
      "width": 411,
      "height": 731
    },
    {
      "label": "big",
      "width": 1024,
      "height": 768
    }
  ],
  "onBeforeScript": "puppet/onBefore.js",
  "onReadyScript": "puppet/onReady.js",
  "scenarios": [
    {
      "label": "111 start page",
      "url": "http://localhost:3000/start",
      "selectors": ["document"]
    },
    {
      "label": "Proxy user question",
      "url": "http://localhost:3000/start/proxy",
      "selectors": ["document"]
    },
    {
      "label": "Proxy user message",
      "url": "http://localhost:3000/start/proxy-message",
      "selectors": ["document"]
    },
    {
      "label": "Module zero",
      "url": "http://localhost:3000/start/emergency-check",
      "selectors": ["document"]
    },
    {
      "label": "Date of birth or age",
      "url": "http://localhost:3000/start/date-of-birth",
      "selectors": ["document"]
    },
    {
      "label": "Date of birth or age - expanded",
      "url": "http://localhost:3000/start/date-of-birth",
      "onReadyScript": "puppet/expand-collapsed.js",
      "selectors": ["document"]
    },
    {
      "label": "Sex",
      "url": "http://localhost:3000/start/sex",
      "selectors": ["document"]
    },
    {
      "label": "Location - start",
      "url": "http://localhost:3000/start/where-are-you",
      "selectors": ["document"]
    },
    {
      "label": "Location - at home",
      "url": "http://localhost:3000/start/at-home",
      "selectors": ["document"]
    },
    {
      "label": "Location - not at home",
      "url": "http://localhost:3000/start/not-at-home",
      "selectors": ["document"]
    },
    {
      "label": "Location - not at home postcode",
      "url": "http://localhost:3000/start/postcode-away",
      "selectors": ["document"]
    },
    {
      "label": "Location - geolocate",
      "url": "http://localhost:3000/start/geo-attempt",
      "selectors": ["document"]
    },
    {
      "label": "Finding pathways - start",
      "url": "http://localhost:3000/finding-pathways/start",
      "selectors": ["document"]
    },
    {
      "label": "Finding pathways - categories",
      "url": "http://localhost:3000/finding-pathways/browse",
      "selectors": ["document"]
    },
    {
      "label": "Finding pathways - categories, help open",
      "url": "http://localhost:3000/finding-pathways/browse",
      "onReadyScript": "puppet/expand-details.js",
      "selectors": ["document"]
    },
    {
      "label": "Finding pathways - categories example",
      "url": "http://localhost:3000/finding-pathways/categories/accidental-overdose-or-swallowed-an-object",
      "selectors": ["document"]
    },
    {
      "label": "Finding pathways - all pathways list",
      "url": "http://localhost:3000/finding-pathways/browse-a-z",
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
