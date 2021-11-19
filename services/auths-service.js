const models = require("../sequelize/models");
const { NIL: NUL_UUID } = require('uuid');
const validateAndThrowExceptionHelper = require('../ajv/helpers/validate-and-throw-exception-helper');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const CorruptedDataException = require('./exceptions/corrupted-data-exception');
const SignInFailureException = require('./exceptions/auths/sign-in-failure-exception');
const InvalidAccessTokenException = require('./exceptions/auths/invalid-access-token-exception');
const AccessTokenNotExpiredYetException = require('./exceptions/auths/access-token-not-expired-yet-exception');
const InvalidRefreshTokenException = require('./exceptions/auths/invalid-refresh-token-exception');
const ExpiredRefreshTokenException = require('./exceptions/auths/expired-refresh-token-exception');

const resendOTPSchema = require('../ajv/schemas/auths/resend-otp-schema');
const signInSchema = require('../ajv/schemas/auths/sign-in-schema');
const refreshAccessTokenSchema = require('../ajv/schemas/auths/refresh-access-token-schema');

const usersService = require("./users-service");
const accountsService = require("./accounts-service");
const accountRolesService = require("./account-roles-service");
const emailsService = require("./emails-service");

const authsService = {
    async registerNewBidderUserAsync(firstName, lastName, dob, email, address, password) {
        const results = await models.sequelize.transaction(async (transaction) => {
            const user = await usersService.createAsync(
                firstName,
                lastName,
                dob,
                email,
                address,
                NUL_UUID,
                transaction);

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

        if (!account.AccountRoles || account.AccountRoles.length !== 1) {
            throw new CorruptedDataException();
        }

        // Building tokens
        var accessToken = await buildAccessTokenAsync(account);
        var refreshToken = await accountsService.createOrUpdateRefreshTokenAsync(
            account,
            account.id);

        return { accessToken, refreshToken };
    },

    async refreshAccessTokenAsync(expiredAccessToken, refreshToken) {
        const data = {
            expiredAccessToken,
            refreshToken,
        };

        validateAndThrowExceptionHelper(refreshAccessTokenSchema,
            data);

        var decoded = null;
        try {
            decoded = jwt.verify(expiredAccessToken, process.env.PRIVATE_KEY, { ignoreExpiration: true });
        } catch (error) {
            throw new InvalidAccessTokenException();
        }

        const executedAt = new moment().toDate();
        if (decoded.exp > executedAt) {
            throw new AccessTokenNotExpiredYetException();
        }

        const account = await accountsService.getActiveAccountByIdAsync(decoded.uid);
        if (!account) {
            throw new CorruptedDataException();
        }

        if (account.refreshToken !== refreshToken) {
            throw new InvalidRefreshTokenException();
        }

        if (account.refreshTokenExpiryDate < executedAt) {
            throw new ExpiredRefreshTokenException();
        }

        await accountsService.updateRefreshTokenExpiryDateAsync(account);
        const result = await buildAccessTokenAsync(account);

        return result;
    },

    async updateProfileAsync(firstName, lastName, dob, email, address, executedBy) {
        await models.sequelize.transaction(async (transaction) => {
            var user = await usersService.updateProfileAsync(firstName,
                lastName,
                dob,
                email,
                address,
                executedBy,
                transaction);

            if (email.toLowerCase() !== user.email.toLowerCase()) {
                await accountsService.resetOtpWhenUpdateEmailAsync(user.account,
                    transaction);

                // Send OTP via Email
                await emailsService.sendUserRegistrationEmailAsync(
                    user.firstName,
                    user.lastName,
                    user.email,
                    account.otp);
            }
        });
    },
};

async function buildAccessTokenAsync(account) {
    const result = await jwt.sign(
        {
            uid: account.id,
            firstName: account.User.firstName,
            lastName: account.User.lastName,
            email: account.User.email,
            role: account.AccountRoles.find(x => x).roleId,
        },
        process.env.PRIVATE_KEY,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
        });

    return result;
}

module.exports = authsService;