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
        'userId',
        'password',
        'isOtpVerified',
        'isActive',
        'createdBy',
        'updatedBy',
    ],
    additionalProperties: false,
};

module.exports = schema;