// backend/routes/api/index.js
// Purpose: This file contains the routes for the API of the FoodTrek application.
// Details: This file contains the routes for the API of the FoodTrek application. The code snippet provided is a part of the file that adds a route to test the API. The route responds with the request body as a JSON object.

const router = require('express').Router();

router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
});

module.exports = router;