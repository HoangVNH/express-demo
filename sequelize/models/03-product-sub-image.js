'use strict';
const {
    Model,
    DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
    class ProductSubImage extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    ProductSubImage.init({
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        productId: {
            allowNull: false,
            type: DataTypes.UUID,
            references: {
                model: 'Products',
                key: 'id',
            },
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        imagePath: {
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
        modelName: 'ProductSubImage',
        indexes: [
        ],
    });
    return ProductSubImage;
};