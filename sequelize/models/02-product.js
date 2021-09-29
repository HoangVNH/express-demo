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
        categoryId: {
            allowNull: false,
            type: DataTypes.UUID,
            references: {
                model: 'Categories',
                key: 'id',
            },
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        imageName: {
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
        modelName: 'Product',
        indexes: [
            {
                type: 'FULLTEXT',
                fields: [
                    "name",
                ]
            },
        ],
    });
    return Product;
};