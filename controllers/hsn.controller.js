const HSN = require('../models/hsn.model.js');

// Create and Save a new hsn
exports.create = (req, res) => {
    // Validate request
    if(!req.body.hsnId) {
        return res.status(400).send({
            success: false,
            message: "HSNId can not be empty"
        });
    }

    // Create a HSN
    const hsn = new HSN({
        hsnId: req.body.hsnId,
        SGST: req.body.SGST,
        CGST: req.body.CGST,
        IGST: req.body.IGST,
      });

    // SaveHSN in the database
    hsn.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: err.message || "Error occurred while saving the HSN."
        });
    });
};

// Retrieve and return all hsns from the database.
exports.findAll = (req, res) => {
    HSN.find()
    .then(hsns => {
        res.send(hsns);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving hsns."
        });
    });
};

// Find a single hsn with a hsnId
exports.findOne = (req, res) => {
    HSN.find({hsnId: req.params.hsnId})
    .then(hsn => {
        if(!hsn) {
            return res.status(404).send({
                success: false,
                message: "HSN not found with id " + req.params.hsnId
            });            
        }
        res.send(hsn);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                success: false,
                message: "HSN not found with id " + req.params.hsnId
            });                
        }
        return res.status(500).send({
            success: false,
            message: "Error retrieving hsn with id " + req.params.hsnId
        });
    });
};

// Delete a hsn with the specified hsnId in the request
exports.delete = (req, res) => {
    HSN.findOneAndRemove({hsnId: req.params.hsnId})
    .then(hsn => {
        if(!hsn) {
            return res.status(404).send({
                success: false,
                message: "hsn not found with id " + req.params.hsnId
            });
        }
        res.send({message: "hsn deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                success: false,
                message: "hsn not found with id " + req.params.hsnId
            });                
        }
        return res.status(500).send({
            success: false,
            message: "Could not delete hsn with id " + req.params.hsnId
        });
    });
};

exports.getDetails = (req, callback) => {
    HSN.find({hsnId: req.body.hsnId})
    .then(hsn => {
        if(!hsn) {
            return callback("HSN not found ", null);         
        }
        hsn = hsn[0]
        let tax = hsn.IGST + hsn.SGST + hsn.CGST;
        hsn.tax = tax;

        return callback(null, hsn);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return callback("HSN not found", null);               
        }
        return callback("Error retrieving hsn", null);         

    });
};