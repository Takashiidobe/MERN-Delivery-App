const express = require("express");
const keys = require("./keys.json");
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
  });
});

app.post("/query", (req, res) => {
  const searchRequest = {
    term: `${req.body.place}`,
    location: `${req.body.address}`,
    radius: `${req.body.radius}`,
    sort_by: `${req.body.sort_by}`,
    price: `${req.body.price}`
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

//phone page section
app.get("/phone", (req, res) => {
  res.render("phone.ejs");
});

//phone post request
app.get("/phone/query", (req, res) => {
  res.render("phoneQuery.ejs", {
    total: "",
    businesses: [
      {
        rating: "",
        price: "",
        phone: "",
        id: "",
        alias: "",
        categories: [
          {
            alias: "",
            title: ""
          }
        ],
        review_count: "",
        name: "",
        url: "",
        coordinates: {
          latitude: "",
          longitude: ""
        },
        image_url: "",
        is_closed: "",
        location: {
          city: "",
          country: "",
          address2: "",
          address3: "",
          state: "",
          address1: "",
          zip_code: ""
        },
        transactions: [""]
      }
    ]
  });
});

app.post("/phone/query", (req, res) => {
  const searchRequest = {
    phone: `+${req.body.phone_number}`
  };

  client
    .phoneSearch(searchRequest)
    .then(response => {
      const firstResult = response.jsonBody;
      const prettyJson = JSON.stringify(firstResult, null, 4);
      console.log(prettyJson);
      res.render("phoneQuery.ejs", {
        total: firstResult.total,
        businesses: [
          {
            rating: firstResult.businesses.rating,
            price: firstResult.businesses.price,
            phone: firstResult.businesses.phone,
            id: firstResult.businesses.id,
            alias: firstResult.businesses.alias,
            categories: [
              {
                alias: firstResult.businesses.categories[0].alias,
                title: firstResult.businesses.categories[0].title
              }
            ],
            review_count: firstResult.businesses.review_count,
            name: firstResult.businesses.name,
            url: firstResult.businesses.url,
            coordinates: {
              latitude: firstResult.businesses.coordinates.latitude,
              longitude: firstResult.businesses.coordinates.longitude
            },
            image_url: firstResult.businesses.image_url,
            is_closed: firstResult.businesses.is_closed,
            location: {
              city: firstResult.businesses.location.city,
              country: firstResult.businesses.location.country,
              address2: firstResult.businesses.location.address2,
              address3: firstResult.businesses.location.address3,
              state: firstResult.businesses.location.state,
              address1: firstResult.businesses.location.address1,
              zip_code: firstResult.businesses.location.zip_code
            },
            transactions: [firstResult.businesses.transactions]
          }
        ]
      });
    })
    .catch(e => {
      console.log(e);
    });
});

app.get("/delivery", (req, res) => {
  res.render("delivery.ejs", {
    businesses: ''
    // results: [],
    // business_id: [],
    // business_alias: [],
    // business_price: [],
    // business_url: [],
    // business_rating: [],
    // business_zip_code: [],
    // business_state: [],
    // business_city: [],
    // business_address2: [],
    // business_address3: [],
    // business_address1: [],
    // business_category_alias: [],
    // business_category_title: [],
    // business_phone: [],
    // business_coordinates_longitude: [],
    // business_coordinates_latitude: [],
    // business_image_url: [],
    // business_is_closed: [],
    // business_name: [],
    // business_review_count: [],
    // business_transactions: []
  });
});

app.post("/delivery/results", (req, res) => {
  client
    .transactionSearch("delivery", {
      location: `${req.body.address}`
    })
    .then(response => {
      //returns all the objects that we have
      let x = response.jsonBody.businesses;
      // console.log(x.length);
      // console.log(x);

      let business_id = [];
      let business_alias = [];
      let business_price = [];
      let business_url = [];
      let business_rating = [];
      let business_zip_code = [];
      let business_state = [];
      let business_city = [];
      let business_address2 = [];
      let business_address3 = [];
      let business_address1 = [];
      let business_category_alias = [];
      let business_category_title = [];
      let business_phone = [];
      let business_coordinates_longitude = [];
      let business_coordinates_latitude = [];
      let business_image_url = [];
      let business_is_closed = [];
      let business_name = [];
      let business_review_count = [];
      let business_transactions = [];

      console.log(x.length);
      for (let i = 0; i < x.length; i++) {
        business_id.push(x[i].id);
        business_alias.push(x[i].alias);
        business_price.push(x[i].price);
        business_url.push(x[i].url);
        business_rating.push(x[i].rating);
        business_zip_code.push(x[i].location.zip_code);
        business_state.push(x[i].location.state);
        business_city.push(x[i].location.city);
        business_address2.push(x[i].location.address2);
        business_address3.push(x[i].location.address3);
        business_address1.push(x[i].location.address1);
        business_category_alias.push(x[i].categories.alias);
        business_category_title.push(x[i].categories.title);
        business_phone.push(x[i].phone);
        business_coordinates_longitude.push(x[i].coordinates.longitude);
        business_coordinates_latitude.push(x[i].coordinates.latitude);
        business_image_url.push(x[i].image_url);
        business_is_closed.push(x[i].is_closed);
        business_name.push(x[i].name);
        business_review_count.push(x[i].review_count);
        business_transactions.push(x[i].transactions);
      }

      console.log(business_id);
      console.log(business_alias);
      console.log(business_price);
      console.log(business_url);
      console.log(business_rating);
      console.log(business_zip_code);
      console.log(business_state);
      console.log(business_city);
      console.log(business_address2);
      console.log(business_address3);
      console.log(business_address1);
      console.log(business_category_alias);
      console.log(business_category_title);
      console.log(business_phone);
      console.log(business_coordinates_latitude);
      console.log(business_coordinates_longitude);
      console.log(business_image_url);
      console.log(business_is_closed);
      console.log(business_name);
      console.log(business_review_count);
      console.log(business_transactions);

      res.render("deliveryResults.ejs", {
        businesses: x
        // results: results.push(response.jsonBody.businesses[i].result),
        // business_id: response.jsonBody.businesses[0].id,
        // business_alias: response.jsonBody.businesses[0].alias,
        // business_price: response.jsonBody.businesses[0].price,
        // business_url: response.jsonBody.businesses[0].url,
        // business_rating: response.jsonBody.businesses[0].rating,
        // business_zip_code: response.jsonBody.businesses.location.zip_code,
        // business_state: response.jsonBody.businesses.location.state,
        // business_city: response.jsonBody.businesses.location.city,
        // business_address2: repsonse.jsonBody.businesses.location.address2,
        // business_address3: response.jsonBody.businesses.location.address3,
        // business_address1: response.jsonBody.businesses.location.address1,
        // business_category_alias: response.jsonBody.businesses.categories.alias,
        // business_category_title: response.jsonBody.businesses.categories.title,
        // business_phone: response.jsonBody.businesses.phone,
        // business_coordinates_longitude: response.jsonBody.businesses.coordinates.longitude,
        // business_coordinates_latitude: response.jsonBody.businesses.coordinates.latitude,
        // business_image_url: response.jsonBody.businesses.image_url,
        // bussiness_is_closed: repsonse.jsonBody.businesses.is_closed,
        // business_name: response.jsonBody.businesses.name,
        // business_review_count: response.jsonBody.businesses.review_count,
        // business_transactions: response.jsonBody.businesses.transactions
      })
      
    })
    .catch(e => {
      console.log(e);
    });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
