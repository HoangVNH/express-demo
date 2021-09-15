'use strict';
const {
    Model,
    DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
    class BiddingLog extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    BiddingLog.init({
        auctionId: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            references: {
                model: 'Auctions',
                key: 'id',
            },
        },
        bidderId: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            references: {
                model: 'Users',
                key: 'id',
            },
        },
        biddedPrice: {
            allowNull: false,
            type: DataTypes.DECIMAL(65, 2),
        },
        isActive: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
        },
        createdBy: {
            allowNull: false,
            type: DataTypes.UUID,
        },
        updatedBy: {
            allowNull: false,
            type: DataTypes.UUID,
        },
    }, {
        sequelize,
        modelName: 'BiddingLog',
        indexes: [
        ],
    });
    return BiddingLog;
};