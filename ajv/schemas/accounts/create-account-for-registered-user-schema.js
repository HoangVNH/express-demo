const schema = {
    type: 'object',
    properties: {
        id: {
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
        'id',
        'password',
        'isOtpVerified',
        'isActive',
        'createdBy',
        'updatedBy',
    ],
    additionalProperties: false,
};

module.exports = schema;