const usersRepository = require("../sequelize/models").User;
const userRegisterSchema = require('../ajv/schemas/users/user-register-schema');
const validateAndThrowExceptionHelper = require('../ajv/helpers/validate-and-throw-exception-helper');
const UniqueConstraintViolatedException = require('./exceptions/unique-constraint-violated-exception');
const db = require('../sequelize/models');
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

        const results = await db.sequelize.transaction(async (transaction) => {
            const user = await usersRepository.create(data, { transaction });

            user.account = await accountsService.createAccountForRegisteredUserAsync(
                user.id,
                password,
                transaction);

            await emailsService.sendUserRegistrationEmailAsync(
                user.firstName,
                user.lastName,
                user.email,
                user.account.otp);

            return user;
        });

        return results;
    },
};

async function isExistEmailAsync(email) {
    // TODO: enhance this method to check exist actually and return true/false only,
    // select all attibutes and count records are not good solution
    var result = await usersRepository.findOne({
        where: {
            email: email,
        },
    });

    return result !== null;
};

module.exports = usersService;