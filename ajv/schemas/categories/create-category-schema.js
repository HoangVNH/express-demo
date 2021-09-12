const schema = {
    type: 'object',
    properties: {
        parentId: {
            type: 'string',
            nullable: true,
            format: 'uuid',
        },
        name: { type: 'string' },
        isActive: { type: 'boolean' },
        createdBy: { type: 'string' },
        updatedBy: { type: 'string' },
    },
    required: [
        'name',
        'isActive',
        'createdBy',
        'updatedBy',
    ],
    additionalProperties: false,
};

module.exports = schema;