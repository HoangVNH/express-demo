const schema = {
    type: 'object',
    properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: {
            type: 'string',
            format: 'email',
        },
        address: { type: 'string' },
        isActive: { type: 'boolean' },
        createdBy: { type: 'string' },
        updatedBy: { type: 'string' },
    },
    required: [
        'firstName',
        'lastName',
        'email',
        'address',
        'isActive',
        'createdBy',
        'updatedBy',
    ],
    additionalProperties: false,
};

module.exports = schema;