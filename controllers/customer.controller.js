const Customer = require('../models/customer.model.js');

const jwt = require('jsonwebtoken');
let config = require('../util/config');


// Retrieve and return all customers from the database.
exports.findAll = (req, res) => {
    Customer.find()
    .then(customers => {
        res.send(customers);
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: err.message || "Some error occurred while retrieving customers."
        });
    });
};

// Find a single customer with a customerId
exports.findOne = (req, res) => {
    Customer.find({customerId: req.params.customerId})
    .then(customer => {
        if(!customer) {
            return res.status(404).send({
                success: false,
                message: "Customer not found with id " + req.params.customerId
            });            
        }
        res.send(customer);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                success: false,
                message: "Customer not found with id " + req.params.customerId
            });                
        }
        return res.status(500).send({
            success: false,
            message: "Error retrieving customer with id " + req.params.customerId
        });
    });
};


// Find a single customer with a customerId
exports.findByName = (req, res) => {
    Customer.find({customerId: req.params.customerName})
    .then(customer => {
        if(!customer) {
            return res.status(404).send({
                success: false,
                message: "Customer not found with id " + req.params.customerName
            });            
        }
        res.send(customer);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                success: false,
                message: "Customer not found with id " + req.params.customerName
            });                
        }
        return res.status(500).send({
            success: false,
            message: "Error retrieving customer with id " + req.params.customerName
        });
    });
};

// Create and Save a new customer
exports.create = (req, res) => {
    // Validate request
    if(!req.body.customerId || !req.body.password) {
        return res.status(400).send({
            success: false,
            message: "details can not be empty!"
        });
    }

    const customer = new Customer({
        customerId: req.body.customerId,
        customerName: req.body.customerName,
        customerAddress: req.body.customerAddress,
        customerPh: req.body.customerPh,
        customerEmail: req.body.customerEmail
    });

    // Save customer in the database
    customer.save()
    .then(data => {
        data.success = true;
        res.send(data);
    }).catch(err => {
        err.success = false;
        err.message1 = err.message;
        err.message = "";
        if (err.message1.includes('customerId')){
            err.message = err.message + 'Customername is already taken. \n';
        }
        res.status(500).send(err);
    });
};

// Update a customer identified by the customerId in the request
exports.update = (req, res) => {
    if(!req.body.customerId) {
        return res.status(400).send({
            success: false,
            message: "Customer content can not be empty"
        });
    }

    // Find customer and update it with the request body
    Customer.findOneAndUpdate({customerId: req.body.customerId} , {$set:{
        customerId: req.body.customerId
    }}, {new: true}, (err, doc) => {
        if(err){
            console.log(err);
        }
    })
    .then(customer => {
        if(!customer) {
            return res.status(404).send({
                success: false,
                message: "Customer not found with id " + req.params.customerId
            });
        }
        res.send(customer);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                success: false,
                message: "Customer not found with id " + req.params.customerId
            });                
        }
        return res.status(500).send({
            success: false,
            message: "Error updating customer with id " + req.params.customerId
        });
    });
};


// Delete a customer with customerId
exports.delete = (req, res) => {
    Customer.findOneAndRemove({customerId: req.params.customerId})
    .then(customer => {
        if(!customer) {
            return res.status(404).send({
                success: false,
                message: "customer not found with id " + req.params.customerId
            });
        }
        res.send({message: "customer deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                success: false,
                message: "customer not found with id " + req.params.customerId
            });                
        }
        return res.status(500).send({
            success: false,
            message: "Could not delete customer with id " + req.params.customerId
        });
    });
};