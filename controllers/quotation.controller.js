const Quotation = require('../models/quotation.model.js');
const products = require('./product.controller.js');
const hsns = require('./hsn.controller.js');


var moment = require('moment');
// Create and Save a new quotation
exports.create = (req, res) => {
    // req.body.username = req.decoded.username;
    // Validate request
    // if(!req.body.username) {
    //     return res.status(400).send({
    //         success: false,
    //         message: "user Id can not be empty"
    //     });
    // }

    if(!req.body.quotationId) {
        return res.status(400).send({
            success: false,
            message: "quotation Id can not be empty"
        });
    }
    Quotation.find({quotationId: req.body.quotationId})
    .then(quotation => {
        if (quotation.length === 0){
        
                var datetime = new Date();
                let today = datetime.toDateString();

                // Create a Quotation
                const quotation = new Quotation({
                    customerId: req.body.customerId,
                    quotationId: req.body.quotationId,
                    quotationDate: today,
                    quotationItems: []
                });
                // Save quotation in the database
                quotation.save()
                .then(data => {
                    res.send(data);
                }).catch(err => {
                    res.status(500).send({
                        success: false,
                        message: err.message || "Some error occurred while Registering."
                    });
                });
        } else {
            res.send({success: false, message: "quotationId already exists"});
        }
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: err.message || "Error occurred while retrieving quotation."
        });
    });

    
};

// add sol to quotation
exports.addItem = (req, res) => {
    // Find quotation and update it with the request body
    Quotation.find({quotationId: req.params.quotationId})
    .then(quotation => {
        // Check prev sub
        products.getDetails(req, (err, product) => {

            if (err){
                res.json({
                  success: false,
                  message: err
                })
            } else {

                req.body.hsnId = product.productHSN;
                hsns.getDetails(req, (err, hsn) => {

                    if (err){
                        res.json({
                          success: false,
                          message: "HSN not Found"
                        });
                    } else {
                        
                    let discount;
    
                    if (!req.body.discount){
                        discount = 0;
                    } else {
                        discount = eval(req.body.discount);
                    }
    
                    let price = product.productSV;
    
                    let quantity = eval(req.body.quantity);
    
                    let amount = price * quantity;
    
                    let net = amount - ((amount * discount)/100);
    
                    let productId = product.productId;
                    let productName = product.productName;
                    
                    let tax = hsn.tax;

    
                    newProduct = {
                        productId: productId,
                        productName: productName,
                        quantity: quantity,
                        price: price,
                        amount: amount,
                        discount: discount,
                        tax: tax,
                        net: (net + (net*tax)/100)
                    };
    
                    quotation = quotation[0];
    
                    Quotation.updateOne({quotationId: req.params.quotationId}, {$addToSet:
                        {quotationProducts: newProduct}
                        }, {new: true}, (err, doc) => {
                            if (err) {
                                console.log("Something wrong when updating data!");
                            }
                    })
                    .then(quotation => {
                        if(!quotation) {
                            res.json({success: false, message: "Quotation not found with Id "});
                        }
                        res.json({success: true, message: "Quotation updated"});

                    }).catch(err => {
                        if(err.kind === 'ObjectId') {
                            res.json({success: false, message: "Obj Error "});

                        }
                        res.json({success: false, message: "Caught Exp "});
                    });
                }

                });
            }

        });
        
    }).catch(err => {
        console.log(err);
        res.status(500).send({
            success: false,
            message: err.message || "Some error occurred while retrieving quotation."
        });
    });    
};

exports.delItem = (req, res) => {
    // Find quotation and update it with the request body
    let delId = req.params.delId;
    let sep = delId.indexOf("!");
    let productId = delId.slice(0,sep);
    let net = eval(delId.slice(sep+1, ));
    let quotationId = req.params.quotationId;

    Quotation.findOneAndUpdate({quotationId: quotationId}, {$pull:
        {quotationProducts: { productId: productId, net: net } }
        }, {new: true}, (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
            }
    })
    .then(quotation => {
        if(!quotation) {
            res.json({success: false, message: "Quotation not found with Id "});
        }
        res.json({success: true, message: "Quotation updated"});
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            res.json({success: false, message: "Obj Error "});

        }
        res.json({success: false, message: "Caught Excp"});
    });   
};

// Retrieve and return all quotations from the database.
exports.findAll = (req, res) => {
    Quotation.find()
    .then(quotation => {
        res.send(quotation);
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: err.message || "Some error occurred while retrieving quotation."
        });
    });
};

// Find a single quotation with a quotationId
exports.findOne = (req, res) => {
    Quotation.find({quotationId: req.params.quotationId})
    .then(quotation => {
        if(!quotation) {
            return res.status(404).send({
                success: false,
                message: "Quotation not found with id " + req.params.quotationId
            });            
        }
        res.send(quotation);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                success: false,
                message: "Quotation not found with id " + req.params.quotationId
            });                
        }
        return res.status(500).send({
            success: false,
            message: "Error retrieving quotation with id " + req.params.quotationId
        });
    });
};