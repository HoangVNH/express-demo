const schema = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            format: 'email',
        },
    },
    required: [
        'email',
    ],
    additionalProperties: false,
};

module.exports = schema;