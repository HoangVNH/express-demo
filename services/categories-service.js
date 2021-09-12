const categoriesRepository = require("../sequelize/models").Category;
const { Op } = require("sequelize");

const validateAndThrowExceptionHelper = require('../ajv/helpers/validate-and-throw-exception-helper');
const createCategorySchema = require('../ajv/schemas/categories/create-category-schema');
const UniqueConstraintViolatedException = require('./exceptions/unique-constraint-violated-exception');

const categoriesService = {
    async createActiveAsync(name, parentId, executedBy) {
        var data = {
            name: name,
            parentId: parentId,
            isActive: true,
            createdBy: executedBy,
            updatedBy: executedBy,
        };

        validateAndThrowExceptionHelper(createCategorySchema, data);

        var result = await getByNameAsync(name);
        if (result === null) {
            result = categoriesRepository.create(data);
        }
        else if (result.isActive) {
            throw new UniqueConstraintViolatedException(data.name);
        } else {
            result.parentId = data.parentId;
            result.isActive = true;
            result.updatedBy = executedBy;

            await result.update({
                parentId: data.parentId,
                isActive: true,
                updatedBy: executedBy,
            });
        }

        return result;
    },

    getAllActiveAsync() {
        var result = categoriesRepository.findAll({
            attributes: [
                'id',
                'parentId',
                'name',
            ],
            where: {
                isActive: true,
            },
        });

        return result;
    },

    getActiveAsync(id) {
        var result = categoriesRepository.findOne({
            attributes: [
                'name',
            ],
            where: {
                isActive: true,
                id: id,
            },
        });

        return result;
    },

    updateActiveAsync(id, name) {
        var result = categoriesRepository.update({
            name: name,
        }, {
            where: {
                isActive: true,
                id: id,
            }
        });

        return result;
    },

    inactiveAsync(id) {
        var result = categoriesRepository.update(
            {
                isActive: false,
            },
            {
                where: {
                    isActive: true,
                    [Op.or]: [
                        { id: id },
                        { parentId: id },
                    ],
                },
            },
        );

        return result;
    },
}

function getByNameAsync(name) {
    var result = categoriesRepository.findOne({
        where: {
            name: name,
        },
    });

    return result;
};

module.exports = categoriesService;