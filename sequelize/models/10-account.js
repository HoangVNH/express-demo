'use strict';
const {
    Model,
    DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
    class Account extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Account.init({
        userId: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            references: {
                model: 'Users',
                key: 'id',
            },
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        otp: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        otpExpiryDate: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        isOtpVerified: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
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
        modelName: 'Account',
        indexes: [
        ],
    });
    return Account;
};