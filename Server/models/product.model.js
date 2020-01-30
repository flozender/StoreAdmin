// MONGOOSE SCHEMA
const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var productSchema = new Schema({
    productId: String,
    productName: String,
    productL: String,
    productW: String,
    productH: String,
    productPV: Number,
    productSV: Number,
    productHSN: String
  });

module.exports = mongoose.model('Product', productSchema);
