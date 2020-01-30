let middleware = require('../util/middleware.js');

module.exports = (app) => {
    const products = require('../controllers/product.controller.js');

    // Create a new product
    app.post('/products', middleware.checkToken, products.create);

    // Retrieve all products
    app.get('/products', middleware.checkToken, products.findAll);

    // Retrieve a single product with productId
    app.get('/products/id/:productId', middleware.checkToken, products.findOne);

    // Update a product with productId
    // app.put('/products', middleware.checkToken, products.update);

    // Delete a product with productId
    app.delete('/products/:productId', middleware.checkToken, products.delete);
}