const schema = {
    type: 'object',
    properties: {
        productId: {
            type: 'string',
            nullable: true,
            format: 'uuid',
        },
        name: { type: 'string' },
        imagePath: { type: 'string' },
        isActive: { type: 'boolean' },
        createdBy: { type: 'string' },
        updatedBy: { type: 'string' },
    },
    required: [
        'productId',
        'name',
        'imagePath',
        'isActive',
        'createdBy',
        'updatedBy',
    ],
    additionalProperties: false,
};

module.exports = schema;