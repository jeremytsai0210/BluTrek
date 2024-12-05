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
const { ValidationError } = require('sequelize');

const isProduction = environment === 'production'; // true or false whether the environment is production or not

const app = express(); // create an express application

app.use(morgan('dev')); // middleware to log all requests and responses to the console
app.use(cookieParser()); // middleware to parse cookies
app.use(express.json()); // middleware to parse JSON bodies of requests

// Security Middleware //
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

// ERROR HANDLING MIDDLEWARE //
// Resource Not Found Error-Handler
// Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});

// Sequelize Error-Handler
// Process sequelize errors
app.use((err, _req, _res, next) => {
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    let errors = {};
    for (let error of err.errors) {
      errors[error.path] = error.message;
    }
    err.title = 'Validation error';
    err.errors = errors;
  }
  next(err);
});

// Error Formatter Error-Handler
// Error formatter
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack
  });
});

module.exports = app;