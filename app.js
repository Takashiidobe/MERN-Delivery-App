const express = require('express');
const app = express();
const axios = require('axios');
const yelp = require('yelp-fusion');
const port = process.env.PORT || 3000;
const apiKey = "eWD0zcvh1Ev_lO8AJHwX0r8Iqv6TLS59YMwDwIC7gQLdKJfVIyiV2bf3OxxviUIuRGEc3CMYMd0OtiOhyj3CwYu52XhtPJhsjah133ZdlrWqaIeqaXqaFZpysn37WnYx";
const clientId = "FmFfqpBLtWddru070Fwktg";
const client = yelp.client(apiKey);
const bodyParser = require('body-parser');


axios.defaults.baseURL = `https://api.yelp.com/v3`;
axios.defaults.headers.get['Authorization'] = `Bearer: ${apiKey}`

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));



app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index.ejs');
});


app.post('/query', (req, res) => {

  const searchRequest = {
    term: `${req.body.place}`,
    location: `${req.body.address}`
  };
  console.log(searchRequest);

  // client.search(searchRequest)
  //   .then((res) => {
  //     const firstResult = res.jsonBody.businesses[0];
  //     const prettyJson = JSON.stringify(firstResult, null, 4);
  //     console.log(prettyJson);
  //   })
  //   .catch(e => {
  //     console.log(e);
  //   });



});



app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})



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