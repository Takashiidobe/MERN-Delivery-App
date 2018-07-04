const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const yelp = require("yelp-fusion");
const keys = require('./config/keys');


//yelp api keys and client invocation
const apiKey = keys.api_key;
const clientId = keys.client_id;
const client = yelp.client(apiKey);


//for the items route
const items = require('./routes/api/items');

//for the results route
const results = require('./routes/api/results');

const app = express();

app.use(cors());
//Bodypraser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//db config
const db = keys.mongoURI;

//Connect to mongo
mongoose.connect(db, {
  useNewUrlParser: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

//Use Routes
app.use('/api/items', items);
app.use('/api/results', results);



const port = process.env.PORT || 5000;

//create a new route called "results" that will render our query to the yelp api
axios.get('http://localhost:5000/api/items', {
  'Content-Type': 'application/json'
})
.then((res) => {
  client.transactionSearch('delivery', {
    latitude: res.data[0].latitude,
    longitude: res.data[0].longitude
  }).then(response => {

    console.log(response.jsonBody.businesses);
    axios({
      method: 'post',
      url: 'http://localhost:5000/api/results',
      headers: {
        'Content-type': 'application/json'
      },
      data: {
        body: response.jsonBody.businesses
      }
    })
    .then((res) => {
      console.log(res);
    })
    })
    .catch((err) => {
      console.log(err);
    });
  }).catch(e => {
    console.log(e);
  })
.catch((err) => {
  console.log(err);
});

//use the yelp fusion api
// client
//   .search(searchRequest)
//   .then()

app.listen(port, () => {
  console.log('We are live on ' + port);
})