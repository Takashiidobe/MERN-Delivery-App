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
//set static files to use
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/css'));

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
  });
});

app.post("/delivery/results", (req, res) => {
  client
    .transactionSearch("delivery", {
      location: `${req.body.address}`
    })
    .then(response => {
      //returns all the objects that we have
      let businesses = response.jsonBody.businesses;
      // console.log(x.length);
      // console.log(x);

      res.render("deliveryResults.ejs", {
        businesses: businesses
      })
      
    })
    .catch(e => {
      console.log(e);
    });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
