'use strict';
const {
    Model,
    DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
    class AuctionDenyUser extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    AuctionDenyUser.init({
        auctionId: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            references: {
                model: 'Auctions',
                key: 'id',
            },
        },
        userId: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            references: {
                model: 'Users',
                key: 'id',
            },
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
        modelName: 'AuctionDenyUser',
        indexes: [
            {
                unique: true,
                fields: [
                    "auctionId",
                    "userId",
                ]
            },
        ],
    });
    return AuctionDenyUser;
};