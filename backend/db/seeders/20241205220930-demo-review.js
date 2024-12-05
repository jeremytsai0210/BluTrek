'use strict';

const { Review } = require('../models');

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
    await Review.bulkCreate([
      {
        spotId: 1, // Times Square Retreat
        userId: 2,
        review: "Absolutely loved staying at the Times Square Retreat! The location was unbeatable, and the place was spotless. Will definitely come back!",
        stars: 5,
      },
      {
        spotId: 2, // Hollywood Hideaway
        userId: 3,
        review: "The Hollywood Hideaway was a dream! So close to everything in LA, and the place was incredibly stylish and clean.",
        stars: 4,
      },
      {
        spotId: 2, // Hollywood Hideaway
        userId: 1,
        review: "Beautiful space and amazing host! Loved the thoughtful touches and the easy check-in process.",
        stars: 5,
      },
      {
        spotId: 3, // Magnificent Mile Loft
        userId: 1,
        review: "The Magnificent Mile Loft had stunning views and was close to all the best spots in Chicago. Highly recommend!",
        stars: 4,
      },
      {
        spotId: 3, // Magnificent Mile Loft
        userId: 2,
        review: "Nice place, but the heating system wasn’t working properly during my stay. Could be improved.",
        stars: 3,
      },
      // Space City Suite (spotId: 4) - No reviews
      // Desert Oasis (spotId: 5) - No reviews
    ], options)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: {
        [Op.gt]: 0
      },
    }, {});
  }
};
