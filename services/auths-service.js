const models = require("../sequelize/models");
const validateAndThrowExceptionHelper = require('../ajv/helpers/validate-and-throw-exception-helper');
const jwt = require('jsonwebtoken');

const CorruptedDataException = require('./exceptions/corrupted-data-exception');
const SignInFailureException = require('./exceptions/auths/sign-in-failure-exception');

const resendOTPSchema = require('../ajv/schemas/auths/resend-otp-schema');
const signInSchema = require('../ajv/schemas/auths/sign-in-schema');

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
        const data = {
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

    async signInAndGenerateTokensAsync(email, plainPassword) {
        const data = {
            email: email,
            password: plainPassword,
        };

        validateAndThrowExceptionHelper(signInSchema,
            data);

        const account = await accountsService.getActiveAccountByEmailAsync(data.email);
        if (account === null) {
            throw new SignInFailureException();
        }

        const isAuthoried = await accountsService.verifyPasswordAsync(
            account,
            data.password);
        if (isAuthoried === false) {
            throw new SignInFailureException();
        }

        const accountRoles = account.AccountRoles;
        if (!accountRoles || accountRoles.length !== 1) {
            throw new CorruptedDataException();
        }

        // Generate tokens
        var accessToken = jwt.sign(
            {
                firstName: account.User.firstName,
                lastName: account.User.lastName,
                email: account.User.email,
                role: accountRoles.find(x => x).roleId,
            },
            process.env.PRIVATE_KEY,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
            });
        var refreshToken = await accountsService.updateNewAccessTokenAsync(
            account,
            account.id);

        return { accessToken, refreshToken };
    },
};

module.exports = authsService;