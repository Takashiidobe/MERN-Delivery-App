const express = require("express");
const router = express.Router();

//Item Model
const Item = require("../../models/Item");

// @route GET api/items
// @desc GET All Items
// @access Public
router.get("/", (req, res) => {
  Item.find()
    .sort({ date: -1 })
    .then(items => res.json(items));
});

// @route POST api/items
// @desc Create An item
// @access Public
router.post("/", (req, res) => {
  const newItem = new Item({
    latitude: req.body.latitude,
    longitude: req.body.longitude
  });

  newItem.save().then(item => res.json(item));
});

// @route DELETE api/items/:id
// @desc Delete an Item
// @access Public
router.delete("/:id", (req, res) => {
  //fetches id from uri
  Item.findById(req.params.id)
    .then(item => item.remove().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;
