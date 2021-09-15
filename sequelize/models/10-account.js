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
            type: DataTypes.STRING,
        },
        seed: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        isVerified: {
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
        // https://stackoverflow.com/questions/34120548/using-bcrypt-with-sequelize-model
        // instanceMethods: {
        //     generateHash(password) {
        //         return bcrypt.hash(password, bcrypt.genSaltSync(this.seed));
        //     },
        //     validPassword(password) {
        //         return bcrypt.compare(password, this.password);
        //     }
        // },
    });
    return Account;
};