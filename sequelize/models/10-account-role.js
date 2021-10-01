'use strict';
const {
    Model,
    DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
    class AccountRole extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.AccountRole.belongsTo(models.Account, {
                foreignKey: 'accountId',
            });
            models.AccountRole.belongsTo(models.Role, {
                foreignKey: 'roleId',
            });
        }
    };
    AccountRole.init({
        accountId: {
            primaryKey: true,
            allowNull: false,
            type: DataTypes.UUID,
            references: {
                model: 'Accounts',
                key: 'id',
            },
        },
        roleId: {
            primaryKey: true,
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
        modelName: 'AccountRole',
        indexes: [
        ],
    });
    return AccountRole;
};