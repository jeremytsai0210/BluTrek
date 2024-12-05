'use strict';

const { SpotImage } = require('../models');

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
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: "https://unsplash.com/photos/photo-of-gray-building-USrZRcRS2Lw",
        preview: true,
      },
      {
        spotId: 1,
        url: "https://unsplash.com/photos/vehicles-parked-along-the-road-near-metal-bridge-fC9ydjoOOHA",
        preview: false,
      },
      {
        spotId: 1,
        url: "https://unsplash.com/photos/people-walking-on-pedestrian-lane-during-night-time-l8ypMiU1Hio",
        preview: false,
      },
      {
        spotId: 1,
        url: "https://unsplash.com/photos/birds-eye-view-of-new-york-usa-during-daytime-9zQkRU9IsDk",
        preview: false,
      },
      {
        spotId: 1,
        url: "https://unsplash.com/photos/gray-bicycle-beside-building-SydhCioEmcw",
        preview: false,
      },
      {
        spotId: 2,
        url: "https://unsplash.com/photos/a-house-with-a-lot-of-plants-and-trees-around-it-Rdk4MMko20s",
        preview: true,
      },
      {
        spotId: 2,
        url: "https://unsplash.com/photos/a-view-of-a-city-from-the-top-of-a-hill-IwWSapTHn98",
        preview: false,
      },
      {
        spotId: 2,
        url: "https://unsplash.com/photos/hollywood-mountain-kIR55P1eXJI",
        preview: false,
      },
      {
        spotId: 2,
        url: "https://unsplash.com/photos/green-palm-trees-near-sea-shore-oWpKOgwssTI",
        preview: false,
      },
      {
        spotId: 3,
        url: "https://unsplash.com/photos/photo-of-high-rise-building-tnv84LOjes4",
        preview: true,
      },
      {
        spotId: 4,
        url: "https://unsplash.com/photos/a-city-skyline-with-a-ferris-wheel-in-the-foreground-_Rx2BD-EMc8",
        preview: true,
      },
      {
        spotId: 4,
        url: "https://unsplash.com/photos/an-aerial-view-of-a-highway-intersection-in-a-city-6JhP4N60x3Q",
        preview: false,
      },
      {
        spotId: 5,
        url: "https://unsplash.com/photos/an-aerial-view-of-a-city-with-mountains-in-the-background-akE66HU-_Kg",
        preview: true,
      },
      {
        spotId: 5,
        url: "https://unsplash.com/photos/aerial-view-of-city-during-daytime-VDpM5hiyTng",
        preview: false,
      },
      {
        spotId: 5,
        url: "https://unsplash.com/photos/a-tall-cactus-sitting-on-top-of-a-rocky-hillside--KrHfjWh53M",
        preview: false,
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
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: {
        [Op.in]: [1, 2, 3, 4, 5]
      }
    });
  }
};
