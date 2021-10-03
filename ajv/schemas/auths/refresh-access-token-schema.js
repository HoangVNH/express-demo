const schema = {
    type: 'object',
    properties: {
        expiredAccessToken: { type: 'string' },
        refreshToken: { type: 'string' },
    },
    required: [
        'expiredAccessToken',
        'refreshToken',
    ],
    additionalProperties: false,
};

module.exports = schema;