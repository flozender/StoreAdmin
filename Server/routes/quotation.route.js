let middleware = require('../util/middleware.js');

module.exports = (app) => {
    const quotations = require('../controllers/quotation.controller.js');

    // Create a new quotation
    app.post('/quotations', middleware.checkToken, quotations.create);

    // Retrieve all quotations
    app.get('/quotations', middleware.checkToken, quotations.findAll);

    // Retrieve a single quotation with quotationId
    app.get('/quotations/:quotationId', middleware.checkToken, quotations.findOne);

    // Add items to quot
    app.post('/quotations/:quotationId', middleware.checkToken, quotations.addItem);

    // Delete item from quotation
    app.post('/quotations/:quotationId/d/:delId', middleware.checkToken, quotations.delItem);

    
    // Update a quotation with quotationId
    // app.put('/quotations', middleware.checkToken, quotations.update);

    // Delete a quotation with quotationId
    // app.delete('/quotations/:quotationId', middleware.checkToken, quotations.delete);
}