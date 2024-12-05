// /backend/app.js
// Purpose: This file is the entry point for the backend of the FoodTrek application. It sets up the express application and adds middleware to the application.
// Details: This file imports the necessary packages and sets up the express application. It adds middleware to the application to log requests and responses, parse cookies, parse JSON bodies of requests, and set security headers. It also sets up CORS, CSRF protection, and other security measures. The code snippet provided is a part of the file that sets up the CSRF token and creates the req.csrfToken method.

const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { environment } = require('./config');
const routes = require('./routes');

const isProduction = environment === 'production'; // true or false whether the environment is production or not

const app = express(); // create an express application

app.use(morgan('dev')); // middleware to log all requests and responses to the console
app.use(cookieParser()); // middleware to parse cookies
app.use(express.json()); // middleware to parse JSON bodies of requests

// Security Middleware
if (!isProduction) {
  // enable cors only in development
  app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin"
  })
);

// Set the _csrf token and create req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true
    }
  })
);

// Routes
app.use(routes); // Connect all the routes

module.exports = app;