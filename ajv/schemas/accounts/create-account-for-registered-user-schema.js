const schema = {
    type: 'object',
    properties: {
        userId: {
            type: 'string',
            format: 'uuid',
        },
        password: { type: 'string' },
        isVerified: { type: 'boolean' },
        isActive: { type: 'boolean' },
        createdBy: { type: 'string' },
        updatedBy: { type: 'string' },
    },
    required: [
        'userId',
        'password',
        'isVerified',
        'isActive',
        'createdBy',
        'updatedBy',
    ],
    additionalProperties: false,
};

module.exports = schema;