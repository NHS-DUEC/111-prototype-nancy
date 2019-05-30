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
      "label": "ED validation - check your answer",
      "url": "http://localhost:3000/user-journeys/check-question",
      "selectors": ["document"]
    },
    {
      "label": "ED validation - offer callback",
      "url": "http://localhost:3000/callback-offered/offer-callback",
      "selectors": ["document"]
    },
    {
      "label": "ED validation - telephone number",
      "url": "http://localhost:3000/book-callback/number",
      "selectors": ["document"]
    },
    {
      "label": "ED validation - call booking name",
      "url": "http://localhost:3000/book-callback/name",
      "selectors": ["document"]
    },
    {
      "label": "ED validation - pick address (at home)",
      "url": "http://localhost:3000/book-callback/confirm-home-address?backstopTest=RG7%206DG",
      "selectors": ["document"]
    },
    {
      "label": "ED validation - confirm address (at home)",
      "url": "http://localhost:3000/book-callback/confirm-home-address?backstopTest=SE1%206LH",
      "selectors": ["document"]
    },
    {
      "label": "ED validation - pick address (not at home)",
      "url": "http://localhost:3000/book-callback/confirm-location-address?backstopTest=RG7%206DG",
      "selectors": ["document"]
    },
    {
      "label": "ED validation - confirm single address (not at home)",
      "url": "http://localhost:3000/book-callback/confirm-location-address?backstopTest=SE1%206LH",
      "selectors": ["document"]
    },
    {
      "label": "ED validation - home postcode",
      "url": "http://localhost:3000/book-callback/home-postcode",
      "selectors": ["document"]
    },
    {
      "label": "ED validation - address not found",
      "url": "http://localhost:3000/book-callback/confirm-home-address?backstopTest=RG7%206FG",
      "selectors": ["document"]
    },
    {
      "label": "ED validation - change postcode",
      "url": "http://localhost:3000/book-callback/change-postcode",
      "selectors": ["document"]
    },
    {
      "label": "ED validation - manual address",
      "url": "http://localhost:3000/book-callback/manual-address",
      "selectors": ["document"]
    },
    {
      "label": "ED validation - call 999 no address",
      "url": "http://localhost:3000/book-callback/call-999-no-address",
      "selectors": ["document"]
    },
    {
      "label": "ED validation - GEOLOCATED user",
      "url": "http://localhost:3000/book-callback/attempt-address-confirmation",
      "selectors": ["document"]
    },
    {
      "label": "ED validation - confirm number to call",
      "url": "http://localhost:3000/book-callback/confirm-number?backstopTest=01234%20567%20890",
      "selectors": ["document"]
    },
    {
      "label": "ED validation - change number",
      "url": "http://localhost:3000/book-callback/change-number",
      "selectors": ["document"]
    },
    {
      "label": "ED validation - call booked",
      "url": "http://localhost:3000/callback-offered//call-booked",
      "selectors": ["document"]
    },
    {
      "label": "ED validation - call booked expanded",
      "url": "http://localhost:3000/callback-offered//call-booked",
      "onReadyScript": "puppet/expand-details.js",
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
