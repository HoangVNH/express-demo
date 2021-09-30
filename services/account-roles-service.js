const repository = require("../sequelize/models").AccountRole;

const RolesEnum = require("../constants/roles-enum");
const validateAndThrowExceptionHelper = require('../ajv/helpers/validate-and-throw-exception-helper');
const CorruptedDataException = require('./exceptions/corrupted-data-exception');
const createAcountRoleSchema = require("../ajv/schemas/account-roles/create-account-role-schema");

const rolesService = require("../services/roles-services");

const accountRolesService = {
    async setAccountAsBidderAsync(acountId, transaction) {
        const result = await assignRoleByRolesEnumAsync(
            acountId,
            RolesEnum.Bidder,
            transaction);

        return result;
    },

    async setAccountAsAdminstratorAsync(acountId, transaction) {
        const result = await assignRoleByRolesEnumAsync(
            acountId,
            RolesEnum.Administrator,
            transaction);

        return result;
    },
};

async function assignRoleByRolesEnumAsync(accountId,
    rolesEnum,
    transaction) {
    const roleId = await rolesService.getRoleIdByEnumAsync(rolesEnum,
        transaction);
    if (roleId === null) {
        throw new CorruptedDataException();
    }

    var result = null;
    const isRoleAlreadyExist = false;
    const roles = await getAssignedRolesAsync(accountId, transaction);
    if (roles !== null && roles.length > 0) {
        for (const x of roles) {
            if (x.roleId === roleId) {
                if (x.isActive === false) {
                    x.isActive = true;

                    await x.save({ transaction });
                }

                isRoleAlreadyExist = true;
                result = x;
            } else {
                x.isActive = false;

                await x.save({ transaction });
            }
        }
    }

    if (isRoleAlreadyExist === false) {
        result = await createAsync(accountId,
            roleId,
            transaction);
    }

    return result;
}

async function getAssignedRolesAsync(accountId,
    transaction) {
    var result = await repository.findAll({
        where: {
            accountId: accountId,
        },
    }, { transaction });

    return result;
}

async function createAsync(accountId, roleId, transaction) {
    var data = {
        accountId: accountId,
        roleId: roleId,
        isActive: true,
        createdBy: accountId,
        updatedBy: accountId,
    };

    validateAndThrowExceptionHelper(createAcountRoleSchema,
        data);

    // Store in DB
    const result = await repository.create(data, { transaction });

    return result;
};

module.exports = accountRolesService;
