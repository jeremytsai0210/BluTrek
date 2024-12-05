// backend/routes/index.js
// Purpose: This file contains the route for the path /hello/world.
// Details: This file contains the route for the path /hello/world. When a GET request is made to this path, the server sends a response with the message "Hello World!" and sets a CSRF token in a cookie. This route is used to test the CSRF token setup in the backend application.

const express = require('express');
const router = express.Router();

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