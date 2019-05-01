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
      "label": "Start page",
      "url": "http://localhost:3000/start",
      "selectors": ["document"]
    },
    {
      "label": "Proxy user question",
      "url": "http://localhost:3000/start/proxy",
      "selectors": ["document"]
    },
    {
      "label": "Module zero",
      "url": "http://localhost:3000/start/emergency-check",
      "selectors": ["document"]
    },
    {
      "label": "Date of birth",
      "url": "http://localhost:3000/start/date-of-birth",
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
      "label": "Location - not at home",
      "url": "http://localhost:3000/start/not-at-home",
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
      "label": "Finding pathways - results (meds)",
      "url": "http://localhost:3000/finding-pathways/start?query=meds",
      "selectors": ["document"]
    },
    {
      "label": "Emergency prescription - start",
      "url": "http://localhost:3000/emergency-prescription-wizard/start",
      "selectors": ["document"]
    },
    {
      "label": "Emergency prescription - able to contact GP or pharmacist",
      "url": "http://localhost:3000/emergency-prescription-wizard/regular-avenues",
      "selectors": ["document"]
    },
    {
      "label": "Emergency prescription - contact GP or pharmacist",
      "url": "http://localhost:3000/emergency-prescription-wizard/regular-avenues-open",
      "selectors": ["document"]
    },
    {
      "label": "Emergency prescription - next dose",
      "url": "http://localhost:3000/emergency-prescription-wizard/time-till-dose",
      "selectors": ["document"]
    },
    {
      "label": "Emergency prescription - pre service display",
      "url": "http://localhost:3000/emergency-prescription-wizard/get-help-from-a-service",
      "selectors": ["document"]
    },
    {
      "label": "Emergency prescription - recommended service",
      "url": "http://localhost:3000/emergency-prescription-wizard/recommended-service-alt",
      "selectors": ["document"]
    },
    {
      "label": "Emergency prescription - other services",
      "url": "http://localhost:3000/service-display/ed-multiple-services",
      "selectors": ["document"]
    },
    {
      "label": "Emergency prescription - begin referral",
      "url": "http://localhost:3000/emergency-prescription-wizard/numsas-introduction",
      "selectors": ["document"]
    },
    {
      "label": "Emergency prescription - phone",
      "url": "http://localhost:3000/emergency-prescription-wizard/numsas-phone",
      "selectors": ["document"]
    },
    {
      "label": "Emergency prescription - name",
      "url": "http://localhost:3000/emergency-prescription-wizard/numsas-name",
      "selectors": ["document"]
    },
    {
      "label": "Emergency prescription - home postcode",
      "url": "http://localhost:3000/emergency-prescription-wizard/numsas-postcode",
      "selectors": ["document"]
    },
    {
      "label": "Emergency prescription - outcome",
      "url": "http://localhost:3000/emergency-prescription-wizard/recommended-service",
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
