const User = require('../models/user.model.js');

const jwt = require('jsonwebtoken');
let config = require('../util/config');


// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
    User.find()
    .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: err.message || "Some error occurred while retrieving users."
        });
    });
};

// Find a single user with a username
exports.findOne = (req, res) => {
    User.find({username: req.params.username})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                success: false,
                message: "User not found with id " + req.params.username
            });            
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                success: false,
                message: "User not found with id " + req.params.username
            });                
        }
        return res.status(500).send({
            success: false,
            message: "Error retrieving user with id " + req.params.username
        });
    });
};


// Create and Save a new user
exports.create = (req, res) => {
    // Validate request
    if(!req.body.username || !req.body.password) {
        return res.status(400).send({
            success: false,
            message: "details can not be empty!"
        });
    }

    const user = new User({
        username: req.body.username,
        password: req.body.password,
    });

    // Save user in the database
    user.save()
    .then(data => {
        data.success = true;
        res.send(data);
    }).catch(err => {
        err.success = false;
        err.message1 = err.message;
        err.message = "";
        if (err.message1.includes('username')){
            err.message = err.message + 'Username is already taken. \n';
        }
        res.status(500).send(err);
    });
};

// Update a user identified by the username in the request
exports.update = (req, res) => {
    if(!req.body.username || !req.body.password) {
        return res.status(400).send({
            success: false,
            message: "User content can not be empty"
        });
    }

    // Find user and update it with the request body
    User.findOneAndUpdate({username: req.body.username} , {$set:{
        username: req.body.username,
        password: req.body.password
    }}, {new: true}, (err, doc) => {
        if(err){
            console.log(err);
        }
    })
    .then(user => {
        if(!user) {
            return res.status(404).send({
                success: false,
                message: "User not found with id " + req.params.username
            });
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                success: false,
                message: "User not found with id " + req.params.username
            });                
        }
        return res.status(500).send({
            success: false,
            message: "Error updating user with id " + req.params.username
        });
    });
};

// Find username and check pass
exports.checkPass = (req, res) => {
    User.find({username: req.body.username})
    .then(user => {
        if(user.length === 0) {
            return res.status(404).send({
                success: false,
                message: "User not found with id " + req.body.username
            });            
        }
        if(user[0].password === req.body.password){
            if(true){
                // Login successful
            let token = jwt.sign(
                {
                    username: user[0].username,
                },
                config.secret,
                {expiresIn: '24h'}
            );
            res.cookie('token', token);
            res.cookie('username', user[0].username);

            // return the JWT token for the future API calls
                res.send({
                    success: true,
                    token: token,
                    username: user[0].username, 
                    message: "Auth successful"
                });
            }
        } else {
            res.send({
                success: false, 
                message: "Incorrect password entered."
            })
        }
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                success: false,
                message: "[caught] User not found with id " + req.body.username
            });                
        }
        return res.status(500).send({
            success: false,
            message: "Error retrieving user with id " + req.body.username
        });
    });
};

// Delete a user with username
exports.delete = (req, res) => {
    User.findOneAndRemove({username: req.params.username})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                success: false,
                message: "user not found with id " + req.params.username
            });
        }
        res.send({message: "user deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                success: false,
                message: "user not found with id " + req.params.username
            });                
        }
        return res.status(500).send({
            success: false,
            message: "Could not delete user with id " + req.params.username
        });
    });
};