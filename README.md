# 111 online protypes
Design prototypes for 111 online project

Note this is prototype code. Not intended for production use.

## Getting started
Make sure you have Node installed (on OSX via [Homebrew](https://brew.sh) is an
easy way of doing it):

`brew install node`

Clone this repo:
`git clone https://git.nhschoices.net/nhs111-digital/nhs111-prototype-kit`

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
docs for more help). Kibana as a UI is handy for this.

Once your search is up and running, the prototype can run locally with the
following commands (use two Terminal tabs):
`elasticsearch`
`grunt`
