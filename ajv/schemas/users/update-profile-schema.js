const schema = {
    type: 'object',
    properties: {
        id: {
            type: 'string',
            format: 'uuid',
        },
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
        updatedBy: { type: 'string' },
    },
    required: [
        'id',
        'firstName',
        'lastName',
        'dob',
        'email',
        'address',
        'updatedBy',
    ],
    additionalProperties: false,
};

module.exports = schema;