// backend/routes/index.js
// Purpose: This file contains the routes for the backend of the FoodTrek application.
// Details: This file contains the routes for the backend of the FoodTrek application. The code snippet provided is a part of the file that adds a route to restore the CSRF token. The route restores the CSRF token by adding a XSRF-TOKEN cookie to the response.

const express = require('express');
const router = express.Router();
const apiRouter = require('./api');

router.use('/api', apiRouter);

// router.get('/hello/world', function(req, res) {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   res.send('Hello World!');
// });

// Add a XSRF-TOKEN cookie
router.get("/api/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({
    'XSRF-Token': csrfToken
  });
});

module.exports = router;