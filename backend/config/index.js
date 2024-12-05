// backend/config/index.js
// Purpose: This file contains the configuration for the backend application.
// Details: This file contains the configuration for the backend application, including the environment, port, database file, and JWT configuration. The environment variable is set to the current environment (development by default). The port variable is set to the port specified in the environment variable or 8000 by default. The database file variable is set to the database file specified in the environment variable. The JWT configuration includes the secret and expiration time for JWT tokens.

module.exports = {
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8000,
    dbFile: process.env.DB_FILE,
    jwtConfig: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  };