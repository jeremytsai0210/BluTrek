'use strict';

const { ReviewImage } = require('../models');

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
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: "https://unsplash.com/photos/white-and-brown-cat-lying-on-brown-wooden-floor-BphuDA60if4",
      },
      {
        reviewId: 2,
        url: "https://unsplash.com/photos/a-black-and-white-cat-laying-on-its-back-on-a-bed-Qq3UqgCjH98",
      },
      {
        reviewId: 4,
        url: "https://unsplash.com/photos/a-cat-wearing-a-blue-and-black-checkered-shirt-OtDLRtPzGxQ",
      },
      {
        reviewId: 5,
        url: "https://unsplash.com/photos/orange-cat-AMoTwvqBm3Q",
      },
      {
        reviewId: 1,
        url: "https://unsplash.com/photos/a-cat-wearing-sunglasses-and-looking-at-the-camera-6KaUGzRscyE",
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
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: {
        [Op.gt]: 0
      }
    }, {});
  }
};
