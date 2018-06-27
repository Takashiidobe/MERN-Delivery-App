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
    results: [],
    business_id: [],
    business_alias: [],
    business_price: [],
    business_url: [],
    business_rating: [],
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
      console.log(JSON.stringify(response.jsonBody.businesses[0]));
      console.log(JSON.stringify(response.jsonBody.length));
      res.render("deliveryResults.ejs", {
        results: response.jsonBody.businesses,
        business_id: response.jsonBody.businesses[0].id,
        business_alias: response.jsonBody.businesses[0].alias,
        business_price: response.jsonBody.businesses[0].price,
        business_url: response.jsonBody.businesses[0].url,
        business_rating: response.jsonBody.businesses[0].rating,
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
