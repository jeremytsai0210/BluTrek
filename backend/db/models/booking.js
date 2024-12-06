'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });

      Booking.belongsTo(models.Spot, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE'
      });
    }
  }
  Booking.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: 'Start date must be a valid date'
        },
        isAfter: {
          args: new Date().toISOString().slice(0, 10),
          msg: 'Start date must be after today'
        },
      },
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: 'End date must be a valid date'
        },
        isAfter: {
          args: new Date().toISOString().slice(0, 10),
          msg: 'End date must be after today'
        },
        isAfterStartDate(value) {
          if (new Date(value) < new Date(this.startDate)) {
            throw new Error('End date must be after start date');
          }
        },
      },
    },
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};