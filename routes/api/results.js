const express = require("express");
const router = express.Router();

//Item Model
const Result = require("../../models/Result");

//we are only going to serve a post/get request on this one
// @route GET api/result
// @desc Get last result
// @access Public
//accessed by front-end to pull up results of query
router.get("/", (req, res) => {
  Result.find()
    .sort({ date: -1 })
    .then(items => res.json(items));
});


// @route POST api/result
// @desc post the body of the yelp query
// @access Public
// accessed by back-end to post results
router.post('/', (req, res) => {
  
    const newResult = new Result({
      body: req.body
    });
    newResult.save().then(item => res.json(item));
});

module.exports = router;
