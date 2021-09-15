'use strict';
const {
    Model,
    DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
    class UserRole extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.UserRole.belongsTo(models.User, {
                foreignKey: 'userId',
            });
            models.UserRole.belongsTo(models.Role, {
                foreignKey: 'roleId',
            });
        }
    };
    UserRole.init({
        userId: {
            allowNull: false,
            type: DataTypes.UUID,
            references: {
                model: 'Users',
                key: 'id',
            },
        },
        roleId: {
            allowNull: false,
            type: DataTypes.UUID,
            references: {
                model: 'Roles',
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
        modelName: 'UserRole',
        indexes: [
        ],
    });
    return UserRole;
};