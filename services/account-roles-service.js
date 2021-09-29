const repository = require("../sequelize/models").AccountRole;

const validateAndThrowExceptionHelper = require('../ajv/helpers/validate-and-throw-exception-helper');
const CorruptedDataException = require('./exceptions/corrupted-data-exception');
const createAcountRoleSchema = require("../ajv/schemas/account-roles/create-account-role-schema");

const rolesService = require("../services/roles-services");

const accountRolesService = {
    async setAccountAsBidderAsync(accountId, transaction) {
        var bidderRoleId = await rolesService.getBidderRoleIdAsync(transaction);
        if (bidderRoleId === null) {
            throw new CorruptedDataException();
        }

        // Check need to create or update
        var result = await getAssignedRoleAsync(accountId, bidderRoleId, transaction);
        if (result === null) {
            result = await createAsync(accountId, bidderRoleId, transaction);
        } else if (result.isActive === false) {
            result.isActive = true;

            await result.save({ transaction });
        }

        return result;
    },
};

async function getAssignedRoleAsync(accountId,
    roleId,
    transaction) {
    // TODO: enhance this method to check exist actually and return true/false only,
    // select all attibutes and count records are not good solution
    var result = await repository.findOne({
        where: {
            accountId: accountId,
            roleId: roleId,
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
