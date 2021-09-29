const repository = require("../sequelize/models").Role;
const RolesEnum = require("../constants/roles-enum");

const rolesService = {
    async getAdministratorRoleIdAsync() {
        var result = getRoleIdByEnumAsync(RolesEnum.Administrator, transaction);

        return result;
    },

    async getSalerRoleIdAsync() {
        var result = getRoleIdByEnumAsync(RolesEnum.Saler, transaction);

        return result;
    },

    async getBidderRoleIdAsync(transaction) {
        var result = getRoleIdByEnumAsync(RolesEnum.Bidder, transaction);

        return result;
    },
};

var _roleAdministratorId = null;
var _roleSalerId = null;
var _roleBidderId = null;

async function getRoleIdByEnumAsync(roleEnum, transaction) {
    var result = null;

    switch (roleEnum) {
        case RolesEnum.Administrator:
            if (_roleAdministratorId === null) {
                _roleAdministratorId = await getRoleIdByNameAsync(roleEnum,
                    transaction);
            }

            result = _roleAdministratorId;
            break;
        case RolesEnum.Saler:
            if (_roleSalerId === null) {
                _roleSalerId = await getRoleIdByNameAsync(roleEnum,
                    transaction);
            }

            result = _roleSalerId;
            break;
        case RolesEnum.Bidder:
        default:
            if (_roleBidderId === null) {
                _roleBidderId = await getRoleIdByNameAsync(roleEnum,
                    transaction);
            }

            result = _roleBidderId;
    }


    return result;
};

async function getRoleIdByNameAsync(roleEnum, transaction) {
    const result = await repository.findOne({
        attributes: [
            'id',
        ],
        where: {
            isActive: true,
            name: roleEnum,
        },
    }, { transaction });

    return result.id;
};

module.exports = rolesService;
