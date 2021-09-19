const schema = {
    type: 'object',
    properties: {
        userId: {
            type: 'string',
            format: 'uuid',
        },
        password: { type: 'string' },
        isOtpVerified: { type: 'boolean' },
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