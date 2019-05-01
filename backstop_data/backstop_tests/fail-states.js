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
      "label": "ITK fail",
      "url": "http://localhost:3000/service-display/error-itk-failure",
      "selectors": ["document"]
    },
    {
      "label": "ITK service closes",
      "url": "http://localhost:3000/service-display/error-itk-service-closes",
      "selectors": ["document"]
    },
    {
      "label": "ITK duplication (general)",
      "url": "http://localhost:3000/service-display/error-itk-spam-general",
      "selectors": ["document"]
    },
    {
      "label": "ITK duplication (high acuity)",
      "url": "http://localhost:3000/service-display/error-itk-spam-high-acuity",
      "selectors": ["document"]
    },
    {
      "label": "DoS down - emergency department",
      "url": "http://localhost:3000/service-display/error-dos-down-or-no-results",
      "selectors": ["document"]
    },
    {
      "label": "DoS down - emergency prescriptions",
      "url": "http://localhost:3000/emergency-prescription-wizard/error-dos-down-or-no-results-pharmacy",
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
