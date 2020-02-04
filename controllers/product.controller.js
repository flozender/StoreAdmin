const Product = require('../models/product.model.js');

// Create and Save a new product
exports.create = (req, res) => {
    // Validate request
    if(!req.body.productId) {
        return res.status(400).send({
            success: false,
            message: "ProductId can not be empty"
        });
    }

    if(!req.body.productName) {
        return res.status(400).send({
            success: false,
            message: "ProductName can not be empty"
        });
    }

    // Create a Product
    const product = new Product({
        productId: req.body.productId,
        productName: req.body.productName,
        productL: req.body.productL,
        productW: req.body.productW,
        productH: req.body.productH,
        productPV: req.body.productPV,
        productSV: req.body.productSV,
        productHSN: req.body.productHSN
      });

    // SaveProduct in the database
    product.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: err.message || "Error occurred while saving the Product."
        });
    });
};

// Retrieve and return all products from the database.
exports.findAll = (req, res) => {
    Product.find()
    .then(products => {
        res.send(products);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving products."
        });
    });
};

exports.getAll = (callback) => {
    Product.find({})
    .then(products => {
        // console.log(products);
        return callback(null, products);
    }).catch(err => {
        return callback("Error", null);
    });
};

// Find a single product with a productId
exports.findOne = (req, res) => {
    Product.find({productId: req.params.productId})
    .then(product => {
        if(!product) {
            return res.status(404).send({
                success: false,
                message: "Product not found with id " + req.params.productId
            });            
        }
        res.send(product);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                success: false,
                message: "Product not found with id " + req.params.productId
            });                
        }
        return res.status(500).send({
            success: false,
            message: "Error retrieving product with id " + req.params.productId
        });
    });
};

// // Update a product identified by the productId in the request
// exports.update = (req, res) => {
//     if(!req.body.productId) {
//         return res.status(400).send({
//             success: false,
//             message: "content can not be empty"
//         });
//     }
//     // Findproduct and update it with the request body
//    Product.findOneAndUpdate({productId: req.body.productId}, {$set:{
//         productId: req.body.productId,
//         productName: req.body.productName,
//         productDate: req.body.productDate,
//         productDuration: req.body.productDuration,
//         productStartTime: req.body.productStartTime,
//         productEndTime: req.body.productEndTime
//         }}, {new: true}, (err, doc) => {
//           if(err){
//               console.log("Error Occured");
//           }
//       })
//     .then(product => {
//         if(!product) {
//             return res.status(404).send({
//                 success: false,
//                 message: "Product not found with id " + req.body.productId
//             });
//         }
//         res.send(product);
//     }).catch(err => {
//         if(err.kind === 'ObjectId') {
//             return res.status(404).send({
//                 success: false,
//                 message: "Product not found with id " + req.body.productId
//             });                
//         }
//         return res.status(500).send({
//             success: false,
//             message: "Error updating Product with id " + req.body.productId
//         });
//     });
// };



// Delete a product with the specified productId in the request
exports.delete = (req, res) => {
    Product.findOneAndRemove({productId: req.params.productId})
    .then(product => {
        if(!product) {
            return res.status(404).send({
                success: false,
                message: "product not found with id " + req.params.productId
            });
        }
        res.send({message: "product deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                success: false,
                message: "product not found with id " + req.params.productId
            });                
        }
        return res.status(500).send({
            success: false,
            message: "Could not delete product with id " + req.params.productId
        });
    });
};

exports.getDetails = (req, callback) => {
    Product.find({productId: req.body.productId})
    .then(product => {
        if(!product) {
            return callback("Product not found ", null);         
        }
        product = product[0]
        return callback(null, product);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return callback("Product not found 2", null);               
        }
        return callback("Error retrieving product", null);         

    });
};
