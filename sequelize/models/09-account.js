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
            models.Account.belongsTo(models.User, {
                foreignKey: 'id',
            });
            models.Account.hasMany(models.AccountRole, {
                foreignKey: 'accountId',
            });
        }
    };
    Account.init({
        id: {
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
            type: DataTypes.INTEGER,
        },
        otpExpiryDate: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        otpResendDate: {
            type: DataTypes.DATE,
        },
        isOtpVerified: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
        },
        refreshToken: {
            type: DataTypes.STRING,
        },
        refreshTokenExpiryDate: {
            type: DataTypes.DATE,
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