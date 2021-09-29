const models = require("../sequelize/models");
const repository = models.User;

const validateAndThrowExceptionHelper = require('../ajv/helpers/validate-and-throw-exception-helper');
const UniqueConstraintViolatedException = require('./exceptions/unique-constraint-violated-exception');

const newUserSchema = require('../ajv/schemas/users/new-user-schema');

const usersService = {
    async createAsync(firstName, lastName, email, address, executedBy, transaction) {
        var data = {
            firstName,
            lastName,
            email,
            address,
            isActive: true,
            createdBy: executedBy,
            updatedBy: executedBy,
        };

        validateAndThrowExceptionHelper(newUserSchema, data);

        const isExistEmail = await isExistEmailAsync(data.email);
        if (isExistEmail) {
            throw new UniqueConstraintViolatedException(data.email);
        }

        const result = await repository.create(data, { transaction });

        return result;
    },

    async getActiveUserByEmailAsync(email, attributes) {
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

module.exports = usersService;