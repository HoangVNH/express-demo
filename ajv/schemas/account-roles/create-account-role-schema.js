const schema = {
    type: 'object',
    properties: {
        accountId: {
            type: 'string',
            format: 'uuid',
        },
        roleId: {
            type: 'string',
            format: 'uuid',
        },
        isActive: { type: 'boolean' },
        createdBy: { type: 'string' },
        updatedBy: { type: 'string' },
    },
    required: [
        'accountId',
        'roleId',
        'isActive',
        'createdBy',
        'updatedBy',
    ],
    additionalProperties: false,
};

module.exports = schema;