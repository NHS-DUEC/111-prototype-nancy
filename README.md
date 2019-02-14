# 111 online protypes
Design prototypes for 111 online project

Note this is prototype code. Not intended for production use.

## Getting started
Make sure you have Node installed (on OSX via [Homebrew](https://brew.sh) is an
easy way of doing it):

`brew install node`

Clone this repo:
`git clone https://gitlab.com/111-online/nhs111-prototype-kit`

Install dependencies:
`npm install`

Start local development (Sass and Nodemon watching):
`grunt`

---

If you want to run the search prototypes locally then you need to set up
[elasticsearch](https://www.elastic.co/products/elasticsearch).

On OSX this is simple enough through [Homebrew](https://brew.sh).
`brew install elasticsearch`
`brew install kibana`

Add the data in `/data/searchdata.json` to an ES database (see
[elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)
docs for more help). Kibana as a UI is handy for this. Ensure to use pathways_inc_alias file and POST to http://localhost:9200/pathways_inc_alias/_doc/_bulk?pretty

Once your search is up and running, the prototype can run locally with the
following commands (use two Terminal tabs):
`elasticsearch`
`grunt`
