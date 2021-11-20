const models = require("../sequelize/models");
const repository = models.User;

const validateAndThrowExceptionHelper = require('../ajv/helpers/validate-and-throw-exception-helper');
const UniqueConstraintViolatedException = require('./exceptions/unique-constraint-violated-exception');
const UserDoesNotExistException = require('./exceptions/users/user-does-not-exist-exception');

const createUserSchema = require('../ajv/schemas/users/create-user-schema');
const updateProfileSchema = require('../ajv/schemas/users/update-profile-schema');

const usersService = {
    async createAsync(firstName, lastName, dob, email, address, executedBy, transaction) {
        var data = {
            firstName,
            lastName,
            dob,
            email,
            address,
            isActive: true,
            createdBy: executedBy,
            updatedBy: executedBy,
        };

        validateAndThrowExceptionHelper(createUserSchema, data);

        const isExistEmail = await isExistEmailAsync(data.email);
        if (isExistEmail) {
            throw new UniqueConstraintViolatedException(data.email);
        }

        const result = await repository.create(data, { transaction });

        return result;
    },

    async getAllActiveAsync() {
        var result = await repository.findAll({
            attributes: [
                'id',
                'firstName',
                'lastName',
                'dob',
                'email',
                'address',
            ],
            where: {
                isActive: true,
            },
            include: {
                model: models.Account,
                attributes: [
                    'isOtpVerified',
                    'isActive',
                ],
                required: false, // USING LEFT JOIN
                include: [
                    {
                        model: models.AccountRole,
                        attributes: [
                            'roleId',
                        ],
                        where: {
                            isActive: true,
                        },
                        required: false, // USING LEFT JOIN
                        include: [
                            {
                                model: models.Role,
                                attributes: [
                                    'roleName'
                                ],
                                attributes: [
                                    ['name', 'roleName'],
                                ],
                            },
                        ],
                    },

                ],
            },
            // raw: true, // flatten return object
        });

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

    async updateProfileAsync(id, firstName, lastName, dob, email, address, executedBy, transaction) {
        const data = {
            id,
            firstName,
            lastName,
            dob,
            email,
            address,
            updatedBy: executedBy,
        };

        validateAndThrowExceptionHelper(updateProfileSchema, data);

        const result = await getActiveByIdAsync(data.id,
            [
                {
                    model: models.Account,
                    where: {
                        isActive: true,
                    },
                },
            ],
            transaction);
        if (result === null) {
            throw new UserDoesNotExistException(data.id);
        }

        result.firstName = data.firstName;
        result.lastName = data.lastName;
        result.dob = data.dob;
        result.email = data.email;
        result.address = data.address;
        result.updatedBy = executedBy;

        await result.save({ transaction });

        return result;
    },

    async getActiveAsync(id) {
        var result = await repository.findOne({
            attributes: [
                'id',
                'firstName',
                'lastName',
                'dob',
                'email',
                'address',
            ],
            where: {
                id,
                isActive: true,
            },
            include: {
                model: models.Account,
                attributes: [
                    'isOtpVerified',
                    'isActive',
                ],
                required: false, // USING LEFT JOIN
                include: [
                    {
                        model: models.AccountRole,
                        attributes: [
                            'roleId',
                        ],
                        where: {
                            isActive: true,
                        },
                        required: false, // USING LEFT JOIN
                        include: [
                            {
                                model: models.Role,
                                attributes: [
                                    'roleName'
                                ],
                                attributes: [
                                    ['name', 'roleName'],
                                ],
                            },
                        ],
                    },

                ],
            },
            // raw: true, // flatten return object
        });

        return result;
    },
};

async function getActiveByIdAsync(id, include, transaction) {
    var result = await repository.findOne({
        where: {
            id,
            isActive: true,
        },
        include,
        transaction,
    });

    return result;
}

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