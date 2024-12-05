// backend/config/database.js
// Purpose: This file contains the configuration for the database connection.
// Details: This file contains the configuration for the database connection. It specifies the development and production configurations for the database connection, including the storage location, dialect, seeder storage, and other options. The development configuration uses SQLite as the database, while the production configuration uses PostgreSQL. The production configuration also specifies the dialect options for connecting to a PostgreSQL database with SSL enabled.

const config = require('./index');

module.exports = {
  development: {
    storage: config.dbFile,
    dialect: "sqlite",
    seederStorage: "sequelize",
    logQueryParameters: true,
    typeValidation: true
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    seederStorage: 'sequelize',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    define: {
      schema: process.env.SCHEMA
    }
  }
};