const models = require("../sequelize/models");
const repository = models.User;
const validateAndThrowExceptionHelper = require('../ajv/helpers/validate-and-throw-exception-helper');

const UniqueConstraintViolatedException = require('./exceptions/unique-constraint-violated-exception');
const CorruptedDataException = require('./exceptions/corrupted-data-exception');

const userRegisterSchema = require('../ajv/schemas/users/user-register-schema');
const resendOTPSchema = require('../ajv/schemas/users/resend-otp-schema');

const accountsService = require("./accounts-service");
const emailsService = require("./emails-service");

const usersService = {
    async registerAsync(firstName, lastName, email, address, password, executedBy) {
        var data = {
            firstName,
            lastName,
            email,
            address,
            isActive: true,
            createdBy: executedBy,
            updatedBy: executedBy,
        };

        validateAndThrowExceptionHelper(userRegisterSchema, data);

        const isExistEmail = await isExistEmailAsync(data.email);
        if (isExistEmail) {
            throw new UniqueConstraintViolatedException(data.email);
        }

        const results = await models.sequelize.transaction(async (transaction) => {
            const user = await repository.create(data, { transaction });

            user.Account = await accountsService.createAccountForRegisteredUserAsync(
                user.id,
                password,
                transaction);

            // Send OTP via Email
            await emailsService.sendUserRegistrationEmailAsync(
                user.firstName,
                user.lastName,
                user.email,
                user.Account.otp);

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
            var user = await getActiveUserByEmailAsync(userEmail);
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
        const result = await getActiveUserByEmailAsync(userEmail);
        if (result === null || result.isActive == false) {
            throw new CorruptedDataException();
        }

        await accountsService.verifyAsync(result.Account, otp);

        return result;
    },

    async loginAndGenerateTokensAsync(email, password) {

    },
};

async function isExistEmailAsync(email) {
    // TODO: enhance this method to check exist actually and return true/false only,
    // select all attibutes and count records are not good solution
    var result = await repository.findOne({
        where: {
            email: email,
        },
    });

    return result !== null;
};

async function getActiveUserByEmailAsync(email) {
    var result = await repository.findOne({
        where: {
            isActive: true,
            email: email,
        },
        include: [
            {
                model: models.Account,
            },
        ],
    });

    return result;
}

async function getActiveUserByEmailAsync(email, attributes) {
    var result = await repository.findOne({
        attributes,
        where: {
            isActive: true,
            email: email,
        },
        include: [
            {
                model: models.Account,
            },
        ],
    });

    return result;
}

module.exports = usersService;