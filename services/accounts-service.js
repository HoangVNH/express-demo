const repository = require("../sequelize/models").Account;
const createAccountForRegisteredUserSchema = require('../ajv/schemas/accounts/create-account-for-registered-user-schema');
const validateAndThrowExceptionHelper = require('../ajv/helpers/validate-and-throw-exception-helper');
const bcrypt = require('bcrypt');

const accountsService = {
    async createAccountForRegisteredUserAsync(userId, password, executedBy) {
        var account = {
            userId,
            password,
            isVerified: false,
            isActive: true,
            createdBy: executedBy,
            updatedBy: executedBy,
        };

        validateAndThrowExceptionHelper(createAccountForRegisteredUserSchema,
            account);

        const saltRounds = 10;
        account.password = await bcrypt.hash(account.password, saltRounds);

        result = await repository.create(account);

        return result;
    },
};

module.exports = accountsService;