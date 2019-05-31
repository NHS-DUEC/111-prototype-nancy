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
    // Finding
    {
      "label": "Finding pathways - results (meds)",
      "url": "http://localhost:3000/finding-pathways/start?query=meds",
      "selectors": ["document"]
    },
    // Pathway
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
    // NUMSAS journey
    {
      "label": "Emergency prescription - NUMSAS service",
      "url": "http://localhost:3000/emergency-prescription-wizard/service/numsas/numsas-service-view-stage-1",
      "selectors": ["document"]
    },
    {
      "label": "Emergency prescription - other services",
      "url": "http://localhost:3000/service-display/ed-multiple-services",
      "selectors": ["document"]
    },
    {
      "label": "Emergency prescription - other services open",
      "url": "http://localhost:3000/service-display/ed-multiple-services",
      "onReadyScript": "puppet/expand-collapsed.js",
      "selectors": ["document"]
    },
    {
      "label": "Emergency prescription - begin NUMSAS referral",
      "url": "http://localhost:3000/emergency-prescription-wizard/service/numsas/numsas-introduction",
      "selectors": ["document"]
    },
    {
      "label": "Emergency prescription - phone",
      "url": "http://localhost:3000/emergency-prescription-wizard/service/user-info/phone",
      "selectors": ["document"]
    },
    {
      "label": "Emergency prescription - name",
      "url": "http://localhost:3000/emergency-prescription-wizard/service/user-info/name",
      "selectors": ["document"]
    },
    {
      "label": "Emergency prescription - DOB (if not given before)",
      "url": "http://localhost:3000/emergency-prescription-wizard/service/user-info/dob",
      "selectors": ["document"]
    },
    {
      "label": "Emergency prescription - home postcode",
      "url": "http://localhost:3000/emergency-prescription-wizard/service/user-info/postcode",
      "selectors": ["document"]
    },
    {
      "label": "Emergency prescription - NUMSAS outcome",
      "url": "http://localhost:3000/emergency-prescription-wizard/service/numsas/numsas-service-view-stage-2",
      "selectors": ["document"]
    },
    // GOTO journey
    {
      "label": "Emergency prescription - GOTO outcome",
      "url": "http://localhost:3000/emergency-prescription-wizard/service/goto/goto-service-view",
      "selectors": ["document"]
    },
    // CAS journey
    {
      "label": "Emergency prescription - CAS service",
      "url": "http://localhost:3000/emergency-prescription-wizard/service/cas/cas-start",
      "selectors": ["document"]
    },
    {
      "label": "Emergency prescription - CAS outcome",
      "url": "http://localhost:3000/emergency-prescription-wizard/service/cas/cas-complete",
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
