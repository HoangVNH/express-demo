const schema = {
    type: 'object',
    properties: {
        auctioneerId: {
            type: 'string',
            nullable: true,
        },
        productId: { type: 'string' },
        initPrice: { type: 'number' },
        stepPrice: { type: 'number', nullable: true, },
        binPrice: { type: 'number', nullable: true },
        isAllowNewBidder: { type: 'boolean', nullable: true },
        endedAt: { type: 'string', nullable: true },
        minBiddingPrice: { type: 'number', nullable: true },
        maxBiddingPrice: { type: 'number', nullable: true },
        biddedBy: { type: 'string', nullable: true },
        isActive: { type: 'boolean' },
        createdBy: { type: 'string' },
        updatedBy: { type: 'string' },
    },
    required: [
        'auctioneerId',
        'productId',
        'createdBy',
        'updatedBy',
        'initPrice'
    ],
    additionalProperties: false,
};

module.exports = schema;