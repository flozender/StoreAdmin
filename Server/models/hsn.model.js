// MONGOOSE SCHEMA
const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var hsnSchema = new Schema({
    hsnId: String,
    SGST: Number,
    CGST: Number,
    IGST: Number
  });

module.exports = mongoose.model('HSN', hsnSchema);
