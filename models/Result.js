const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const ResultSchema = new Schema({
  body: {
    type: Schema.Types.Mixed,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Result = mongoose.model('result', ResultSchema);