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
      "label": "01 Get help now",
      "url": "http://localhost:3000/service-display/timings-examples/01-get-help-now",
      "selectors": ["document"]
    },
    {
      "label": "02 Get help within 4 hours",
      "url": "http://localhost:3000/service-display/timings-examples/02-get-help-within-4-hours",
      "selectors": ["document"]
    },
    {
      "label": "03 Get help today",
      "url": "http://localhost:3000/service-display/timings-examples/03-get-help-today",
      "selectors": ["document"]
    },
    {
      "label": "04 Get help as soon as you can today",
      "url": "http://localhost:3000/service-display/timings-examples/04-get-help-as-soon-as-you-can-today",
      "selectors": ["document"]
    },
    {
      "label": "05 Get help today or tomorrow",
      "url": "http://localhost:3000/service-display/timings-examples/05-get-help-today-or-tomorrow",
      "selectors": ["document"]
    },
    {
      "label": "06 Get help within a week",
      "url": "http://localhost:3000/service-display/timings-examples/06-get-help-within-a-week",
      "selectors": ["document"]
    },
    {
      "label": "07 Get an appointment within 3 days",
      "url": "http://localhost:3000/service-display/timings-examples/07-get-an-appointment-within-3-days",
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
