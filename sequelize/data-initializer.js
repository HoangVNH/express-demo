const RolesEnum = require('../constants/roles-enum');
const db = require('./models');
const models = db.sequelize.models;
const { NIL: NUL_UUID } = require('uuid');

const usersService = require("../services/users-service");
const accountsService = require("../services/accounts-service");
const accountRolesService = require("../services/account-roles-service");

async function initDataAsync() {
    const executedBy = NUL_UUID;
    const executedTime = new Date();

    await initializingRolesAsync(executedBy, executedTime);
    await initializingAdministratorAccountAsync(executedBy);
}

async function initializingRolesAsync(executedBy, executedTime) {
    const roleRepository = models.Role;
    const roles = await roleRepository.findAndCountAll();
    if (roles.count === 0) {
        await roleRepository.bulkCreate([
            {
                name: RolesEnum.Administrator,
                isActive: true,
                createdBy: executedBy,
                createdAt: executedTime,
                updatedAt: executedTime,
                updatedBy: executedBy,
            },
            {
                name: RolesEnum.Bidder,
                isActive: true,
                createdBy: executedBy,
                createdAt: executedTime,
                updatedAt: executedTime,
                updatedBy: executedBy,
            },
            {
                name: RolesEnum.Saler,
                isActive: true,
                createdBy: executedBy,
                createdAt: executedTime,
                updatedAt: executedTime,
                updatedBy: executedBy,
            },
        ]);
    }
}

async function initializingAdministratorAccountAsync(executedBy) {
    const userRepository = models.User;
    const users = await userRepository.findAndCountAll();
    if (users.count === 0) {
        await db.sequelize.transaction(async (transaction) => {
            const user = await usersService.createAsync(
                'Administrator', '', 'admined@yopmail.com', '', executedBy, transaction);

            const account = await accountsService.createAccountAsync(
                user.id,
                '123',
                transaction);

            account.isOtpVerified = true;
            await account.save({ transaction });

            await accountRolesService.setAccountAsAdminstratorAsync(
                account.id, transaction);
        });
    }
}

module.exports = initDataAsync;