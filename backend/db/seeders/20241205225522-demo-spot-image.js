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
        url: "https://images.unsplash.com/photo-1448317971280-6c74e016e49c?q=80&w=1832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        preview: true,
      },
      {
        spotId: 1,
        url: "https://images.unsplash.com/photo-1476837754190-8036496cea40?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        preview: false,
      },
      {
        spotId: 1,
        url: "https://images.unsplash.com/photo-1602940659805-770d1b3b9911?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        preview: false,
      },
      {
        spotId: 1,
        url: "https://images.unsplash.com/photo-1518355077561-4af7abce973d?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        preview: false,
      },
      {
        spotId: 1,
        url: "https://images.unsplash.com/photo-1549654747-1fe362f45d7b?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        preview: false,
      },
      {
        spotId: 2,
        url: "https://images.unsplash.com/photo-1709418440159-9958a213324e?q=80&w=1664&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        preview: true,
      },
      {
        spotId: 2,
        url: "https://images.unsplash.com/photo-1711427686399-67e98ab5ada1?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        preview: false,
      },
      {
        spotId: 2,
        url: "https://images.unsplash.com/photo-1518416177092-ec985e4d6c14?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        preview: false,
      },
      {
        spotId: 2,
        url: "https://images.unsplash.com/photo-1526927541727-4654bf5bf29a?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        preview: false,
      },
      {
        spotId: 3,
        url: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        preview: true,
      },
      {
        spotId: 4,
        url: "https://images.unsplash.com/photo-1679516985866-7e62312cb08f?q=80&w=1844&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        preview: true,
      },
      {
        spotId: 4,
        url: "https://images.unsplash.com/photo-1633627290885-0461dd93e8a2?q=80&w=1664&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        preview: false,
      },
      {
        spotId: 5,
        url: "https://images.unsplash.com/photo-1706403222567-06fe8d8dc93e?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        preview: true,
      },
      {
        spotId: 5,
        url: "https://images.unsplash.com/photo-1617407867245-f1315ab14d98?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        preview: false,
      },
      {
        spotId: 5,
        url: "https://images.unsplash.com/photo-1649261223984-545578366b2e?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
