const schema = {
    type: 'object',
    properties: {
        categoryId: {
            type: 'string',
            nullable: true,
            format: 'uuid',
        },
        name: { type: 'string' },
        imageName: { type: 'string' },
        imagePath: { type: 'string' },
        isActive: { type: 'boolean' },
        createdBy: { type: 'string' },
        updatedBy: { type: 'string' },
    },
    required: [
        'categoryId',
        'name',
        'imageName',
        'imagePath',
        'isActive',
        'createdBy',
        'updatedBy',
    ],
    additionalProperties: false,
};

module.exports = schema;