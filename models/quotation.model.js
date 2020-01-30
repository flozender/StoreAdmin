// MONGOOSE SCHEMA
const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);

var Schema = mongoose.Schema;

var quotationSchema = new Schema({
    quotationId: {type: String, unique: true, required: [true, "can't be blank"], index: true},
    quotationDate: String,
    customerId: String,
    username: String,
    quotationProducts: Array
  }, {timestamps: true});

module.exports = mongoose.model('Quotation', quotationSchema);
