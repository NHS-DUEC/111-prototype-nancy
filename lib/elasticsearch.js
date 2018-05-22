var elasticsearch = require('elasticsearch');

if (process.env.BONSAI_URL) {
  var bonsai_url = process.env.BONSAI_URL;
} else {
  var bonsai_url = 'localhost:9200';
}

var client = new elasticsearch.Client( {
  host: bonsai_url
});

module.exports = client;
