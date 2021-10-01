const schema = {
    type: 'object',
    properties: {
        categoryId: {
            type: 'string',
            nullable: true,
            format: 'uuid',
        },
        name: { type: 'string' },
        image: { type: 'string' },
        isActive: { type: 'boolean' },
        createdBy: { type: 'string' },
        updatedBy: { type: 'string' },
    },
    required: [
        'categoryId',
        'name',
        'isActive',
        'createdBy',
        'updatedBy',
    ],
    additionalProperties: false,
};

module.exports = schema;