const express = require("express");
const keys = require('./keys.json');
const app = express();
const axios = require("axios");
const yelp = require("yelp-fusion");
const port = process.env.PORT || 3000;
const apiKey = keys.api_key;
const clientId = keys.client_id;
const client = yelp.client(apiKey);
const bodyParser = require("body-parser");

axios.defaults.baseURL = `https://api.yelp.com/v3`;
axios.defaults.headers.get["Authorization"] = `Bearer: ${apiKey}`;

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

app.get("/query", (req, res) => {
  res.render("query.ejs", {
    id: "",
    alias: "",
    name: "",
    image_url: "",
    is_closed: "",
    url: "",
    review_count: "",
    categories: {
      alias: "",
      title: ""
    },
    rating: "",
    coordinates: {
      latitude: "",
      longitude: ""
    },
    price: "",
    location: {
      address1: "",
      address2: "",
      address3: "",
      city: "",
      zip_code: "",
      country: "",
      state: ""
    },
    phone: "",
    display_phone: "",
    distance: ""
    })
  });

app.post("/query", (req, res) => {
  const searchRequest = {
    term: `${req.body.place}`,
    location: `${req.body.address}`,
    radius: `${req.body.radius}`,
    sort_by: `${req.body.sort_by}`
  };

  client
    .search(searchRequest)
    .then(response => {
      const firstResult = response.jsonBody.businesses[0];
      const prettyJson = JSON.stringify(firstResult, null, 4);
      console.log(prettyJson);
      res.render("query.ejs", {
        id: firstResult.id,
        alias: firstResult.alias,
        name: firstResult.name,
        image_url: firstResult.image_url,
        is_closed: firstResult.is_closed,
        url: firstResult.url,
        review_count: firstResult.review_count,
        categories: {
          alias: firstResult.categories[0].alias,
          title: firstResult.categories[0].title
        },
        rating: firstResult.rating,
        coordinates: {
          latitude: firstResult.coordinates.latitude,
          longitude: firstResult.coordinates.longitude
        },
        price: firstResult.price,
        location: {
          address1: firstResult.location.address1,
          address2: firstResult.location.address2,
          address3: firstResult.location.address3,
          city: firstResult.location.city,
          zip_code: firstResult.location.zip_code,
          country: firstResult.location.country,
          state: firstResult.location.state
        },
        phone: firstResult.phone,
        display_phone: firstResult.display_phone,
        distance: firstResult.distance
      });
    })
    .catch(e => {
      console.log(e);
    });

  console.log(searchRequest);
});



app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

// res.render('query.ejs', {
//   id: firstResult.id,
//   alias: firstResult.alias,
//   name: firstResult.name,
//   image_url: firstResult.image_url,
//   url: firstResult.url,
//   review_count: firstResult.review_count,
// categories: {
//   alias: firstResult.categories.alias,
//   title: firstResult.categories.title
// },
// rating: firstResult.rating,
// coordinates: {
//   latitude: firstResult.coordinates.latitude,
//   longitude: firstResult.coordinates.longitude
// },
// price: firstResult.price,
// location: {
//   address1: firstResult.location.address1,
//   address2: firstResult.location.address2,
//   address3: firstResult.location.address3,
//   city: firstResult.location.city,
//   zip_code: firstResult.location.zip_code,
//   country: firstResult.location.zip_code,
//   country: firstResult.location.country,
//   state: firstResult.location.state,
//   display_address: [
//     firstResult.display_address
//   ]
// },
// phone: firstResult.phone,
// display_phone: firstResult.display_phone,
// distance: firstResult.distance

//to search for nearby places with this header

//phone search
// client.phoneSearch({
//   phone: '+14023271991'
// }).then(response => {
//   console.log(response.jsonBody.businesses[0].name);
// }).catch(e => {
//   console.log(e);
// });

//transaction search

// client.transactionSearch('delivery', {
//   location: 'lincoln'
// }).then(response => {
//   console.log(response.jsonBody.businesses[0].name);
// }).catch(e =>{
//   console.log(e);
// });

//business search
// client.business('cultiva').then(response => {
//   console.log(repsonse.jsonBody.name);
// }).catch(e => {
//   console.log(e);
// });

//reviews
// client.reviews('cultiva-lincoln-nebraska').then(response => {
//   console.log(response.jsonBody.reviews[0].text);
// }).catch(e => {
//   console.log(e);
// });

//autocomplete

// client.autocomplete({
//   text: 'pizza'
// }).then(response => {
//   console.log(response.jsonBody.terms[0].text);
// }).catch(e => {
//   console.log(e);
// });

//business match
// client.businessMatch('lookup', {
//   name: 'Pannikin Coffee & Tea',
//   address1: '510 N Coast Hwy 101',
//   address2: 'Encinitas, CA 92024',
//   city: 'Encinitas',
//   state: 'CA',
//   country: 'US'
// }).then(response => {
//   console.log(response.jsonBody.businesses[0].id);
// }).catch(e => {
//   console.log(e);
// });
