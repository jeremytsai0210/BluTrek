'use strict';

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "123 Broadway",
        city: "New York City",
        state: "New York",
        country: "United States of America",
        lat: 40.712776,
        lng: -74.005974,
        name: "Times Square Retreat",
        description: "A lively spot near the heart of NYC's entertainment district.",
        price: 250
      },
      {
        ownerId: 2,
        address: "456 Sunset Blvd",
        city: "Los Angeles",
        state: "California",
        country: "United States of America",
        lat: 34.052235,
        lng: -118.243683,
        name: "Hollywood Hideaway",
        description: "A serene escape amidst the glitz and glamour of LA.",
        price: 200
      },
      {
        ownerId: 3,
        address: "789 Michigan Ave",
        city: "Chicago",
        state: "Illinois",
        country: "United States of America",
        lat: 41.878113,
        lng: -87.629799,
        name: "Magnificent Mile Loft",
        description: "Enjoy the best shopping and dining in the Windy City.",
        price: 180
      },
      {
        ownerId: 1,
        address: "321 Main St",
        city: "Houston",
        state: "Texas",
        country: "United States of America",
        lat: 29.760427,
        lng: -95.369804,
        name: "Space City Suite",
        description: "Close to NASA and other Houston attractions.",
        price: 150
      },
      {
        ownerId: 2,
        address: "654 Grand Canyon Blvd",
        city: "Phoenix",
        state: "Arizona",
        country: "United States of America",
        lat: 33.448376,
        lng: -112.074036,
        name: "Desert Oasis",
        description: "Relax under the clear skies of the Sonoran Desert.",
        price: 175
      }
    ], options)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Times Square Retreat', 'Hollywood Hideaway', 'Magnificent Mile Loft', 'Space City Suite', 'Desert Oasis'] }
    }, {})
  }

};