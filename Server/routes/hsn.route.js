let middleware = require('../util/middleware.js');

module.exports = (app) => {
    const hsns = require('../controllers/hsn.controller.js');

    // Create a new hsn
    app.post('/hsn', middleware.checkToken, hsns.create);

    // Retrieve all hsns
    app.get('/hsn', middleware.checkToken, hsns.findAll);

    // Retrieve a single hsn with hsnId
    app.get('/hsn/:hsnId', middleware.checkToken, hsns.findOne);

    // Update a hsn with hsnId
    // app.put('/hsns', middleware.checkToken, hsns.update);

    // Delete a hsn with hsnId
    app.delete('/hsn/:hsnId', middleware.checkToken, hsns.delete);
}