const usersRepository = require("../sequelize/models").User;
const userRegisterSchema = require('../ajv/schemas/users/user-register-schema');
const validateAndThrowExceptionHelper = require('../ajv/helpers/validate-and-throw-exception-helper');
const UniqueConstraintViolatedException = require('./exceptions/unique-constraint-violated-exception');
const accountsService = require("./accounts-service");

const usersService = {
    async registerAsync(firstName, lastName, email, address, password, executedBy) {
        var user = {
            firstName,
            lastName,
            email,
            address,
            isActive: true,
            createdBy: executedBy,
            updatedBy: executedBy,
        };

        validateAndThrowExceptionHelper(userRegisterSchema, user);

        const isExistEmail = await isExistEmailAsync(user.email);
        if (isExistEmail) {
            throw new UniqueConstraintViolatedException(user.email);
        }

        const result = await usersRepository.create(user);

        await accountsService.createAccountForRegisteredUserAsync(
            result.id,
            password,
            executedBy);

        return result;
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