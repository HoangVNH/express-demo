'use strict';
const {
    Model,
    DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.User.hasOne(models.Account, {
                foreignKey: 'userId',
            });
        }
    };
    User.init({
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        firstName: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        lastName: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        email: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        address: {
            allowNull: false,
            type: DataTypes.STRING,
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
        modelName: 'User',
        indexes: [
            {
                unique: true,
                fields: [
                    "email",
                ]
            },
        ],
    });
    return User;
};