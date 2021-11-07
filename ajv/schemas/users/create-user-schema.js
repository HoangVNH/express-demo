const schema = {
    type: 'object',
    properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        dob: {
            type: 'string',
            format: 'date',
        },
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
        'dob',
        'email',
        'address',
        'isActive',
        'createdBy',
        'updatedBy',
    ],
    additionalProperties: false,
};

module.exports = schema;