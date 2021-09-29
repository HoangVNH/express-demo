const models = require("../sequelize/models");
const validateAndThrowExceptionHelper = require('../ajv/helpers/validate-and-throw-exception-helper');

const CorruptedDataException = require('./exceptions/corrupted-data-exception');

const resendOTPSchema = require('../ajv/schemas/auths/resend-otp-schema');

const usersService = require("./users-service");
const accountsService = require("./accounts-service");
const accountRolesService = require("./account-roles-service");
const emailsService = require("./emails-service");

const authsService = {
    async registerNewBidderUserAsync(firstName, lastName, email, address, password, executedBy) {
        const results = await models.sequelize.transaction(async (transaction) => {
            const user = await usersService.createAsync(
                firstName, lastName, email, address, executedBy, transaction);

            const account = await accountsService.createAccountAsync(
                user.id,
                password,
                transaction);

            await accountRolesService.setAccountAsBidderAsync(
                user.id, transaction);

            // Send OTP via Email
            await emailsService.sendUserRegistrationEmailAsync(
                user.firstName,
                user.lastName,
                user.email,
                account.otp);

            return user;
        });

        return results;
    },

    async resendOTPAsync(userEmail) {
        var data = {
            email: userEmail,
        };

        validateAndThrowExceptionHelper(resendOTPSchema, data);

        await models.sequelize.transaction(async (transaction) => {
            var user = await usersService.getActiveUserByEmailAsync(userEmail);
            if (user === null || user.isActive === false) {
                throw new CorruptedDataException();
            }

            await accountsService.requestToResendOTPAsync(
                user.Account,
                transaction);

            // Send OTP via Email
            await emailsService.sendUserRegistrationEmailAsync(
                user.firstName,
                user.lastName,
                user.email,
                user.Account.otp);
        });
    },

    async verifyAsync(userEmail, otp) {
        const result = await usersService.getActiveUserByEmailAsync(userEmail);
        if (result === null || result.isActive == false) {
            throw new CorruptedDataException();
        }

        await accountsService.verifyAsync(result.Account, otp);

        return result;
    },
};

module.exports = authsService;