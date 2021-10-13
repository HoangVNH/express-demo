'use strict';
const {
    Model,
    DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
    class Auction extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.Auction.hasMany(models.BiddingLog, {
                foreignKey: 'auctionId',
            });
        }
    };
    Auction.init({
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        auctioneerId: {
            allowNull: false,
            type: DataTypes.UUID,
            references: {
                model: 'Users',
                key: 'id',
            },
        },
        productId: {
            allowNull: false,
            type: DataTypes.UUID,
            references: {
                model: 'Products',
                key: 'id',
            },
        },
        initPrice: {
            allowNull: false,
            type: DataTypes.DECIMAL(65, 2),
        },
        stepPrice: {
            allowNull: false,
            type: DataTypes.DECIMAL(65, 2),
        },
        binPrice: {
            type: DataTypes.DECIMAL(65, 2),
        },
        isAllowNewBidder: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
        },
        endedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        minBiddingPrice: {
            type: DataTypes.DECIMAL(65, 2),
        },
        maxBiddingPrice: {
            type: DataTypes.DECIMAL(65, 2),
        },
        biddedBy: {
            allowNull: false,
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
        modelName: 'Auction',
        indexes: [
        ],
    });
    return Auction;
};