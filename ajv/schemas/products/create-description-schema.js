const schema = {
    type: 'object',
    properties: {
        productId: {
            type: 'string',
            nullable: true,
            format: 'uuid',
        },
        description: { type: 'string' },
        isActive: { type: 'boolean' },
        createdBy: { type: 'string' },
        updatedBy: { type: 'string' },
    },
    required: [
        'productId',
        'description',
        'isActive',
        'createdBy',
        'updatedBy',
    ],
    additionalProperties: false,
};

module.exports = schema;