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
      "label": "999 - check your answer",
      "url": "http://localhost:3000/user-journeys/check-question",
      "selectors": ["document"]
    },
    {
      "label": "999 - call booking start",
      "url": "http://localhost:3000/forced-callback/call-booking-start",
      "selectors": ["document"]
    },
    {
      "label": "999 - call booking name",
      "url": "http://localhost:3000/book-callback/name",
      "selectors": ["document"]
    },
    {
      "label": "999 - pick address",
      "url": "http://localhost:3000/book-callback/confirm-home-address",
      "selectors": ["document"]
    },
    {
      "label": "999 - confirm location address (not at home)",
      "url": "http://localhost:3000/book-callback/confirm-location-address",
      "selectors": ["document"]
    },
    {
      "label": "999 - home postcode",
      "url": "http://localhost:3000/book-callback/home-postcode",
      "selectors": ["document"]
    },
    {
      "label": "999 - address not found",
      "url": "http://localhost:3000/book-callback/address-not-found",
      "selectors": ["document"]
    },
    {
      "label": "999 - change postcode",
      "url": "http://localhost:3000/book-callback/change-postcode",
      "selectors": ["document"]
    },
    {
      "label": "999 - manual address",
      "url": "http://localhost:3000/book-callback/manual-address",
      "selectors": ["document"]
    },
    {
      "label": "999 - call 999 no address",
      "url": "http://localhost:3000/book-callback/call-999-no-address",
      "selectors": ["document"]
    },
    {
      "label": "999 - GEOLOCATED user",
      "url": "http://localhost:3000/book-callback/attempt-address-confirmation",
      "selectors": ["document"]
    },
    {
      "label": "999 - confirm number to call",
      "url": "http://localhost:3000/book-callback/confirm-number",
      "selectors": ["document"]
    },
    {
      "label": "999 - change number",
      "url": "http://localhost:3000/book-callback/change-number",
      "selectors": ["document"]
    },
    {
      "label": "999 - call booked",
      "url": "http://localhost:3000/forced-callback/call-booked",
      "selectors": ["document"]
    },
    {
      "label": "999 - call booked expanded",
      "url": "http://localhost:3000/forced-callback/call-booked",
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
