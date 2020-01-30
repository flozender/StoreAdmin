// MONGOOSE SCHEMA
const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var customerSchema = new Schema({
    customerId: String,
    customerName: String,
    customerAddress: String,
    customerPh: String,
    customerEmail: String
  });

module.exports = mongoose.model('customer', customerSchema);
