const express = require("express");
const keys = require('./keys.json');
const app = express();
const yelp = require("yelp-fusion");
const port = process.env.PORT || 3000;
const apiKey = keys.api_key;
const clientId = keys.client_id;
const client = yelp.client(apiKey);
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get('/delivery', (req, res) => {
  res.render('delivery.ejs');
});

app.listen(port, () => {
  console.log(`server running on port ${port}`)
})