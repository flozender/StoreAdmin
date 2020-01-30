let middleware = require('../util/middleware.js');

module.exports = (app) => {
    const customers = require('../controllers/customer.controller.js');

    // Create a new customer
    app.post('/customers', middleware.checkToken, customers.create);

    // Retrieve all customers
    app.get('/customers', middleware.checkToken, customers.findAll);

    // Retrieve a single customer with customerId
    app.get('/customers/id/:customerId', middleware.checkToken, customers.findOne);

    // Retrieve a single customer with customerId
    app.get('/customers/name/:customerName', middleware.checkToken, customers.findByName);
    
    // Update a customer with customerId
    // app.put('/customers', middleware.checkToken, customers.update);

    // Delete a customer with customerId
    app.delete('/customers/:customerId', middleware.checkToken, customers.delete);
}