'use strict';
const {
    Model,
    DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Product.init({
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING,
            // KNOWN ISSUES #12889 AT: https://github.com/sequelize/sequelize/issues/12889
            // NOTE: DO NOT DECLARE UNIQUE CONSTRANIT LIKE THIS
            // unique: true,
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
        modelName: 'Product',
        indexes: [
            // KNOWN ISSUES #12889 AT: https://github.com/sequelize/sequelize/issues/12889
            // NOTE: SHOULD DO THIS WAY
            {
                unique: true,
                fields: [
                    "name",
                ]
            },
        ],
    });
    return Product;
};