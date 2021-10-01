const schema = {
    type: 'object',
    properties: {
        auctioneerId: {
            type: 'string',
            nullable: true,
        },
        productId: { type: 'string' },
        initPrice: { type: 'DECIMAL' },
        stepPrice: { type: 'DECIMAL', nullable: true, },
        binPrice: { type: 'DECIMAL', nullable: true },
        isAllowNewBidder: { type: 'boolean', nullable: true },
        endedAt: { type: 'datetime', nullable: true },
        minBiddingPrice: { type: 'DECIMAL', nullable: true },
        maxBiddingPrice: { type: 'DECIMAL', nullable: true },
        biddedBy: { type: 'string', nullable: true },
        isActive: { type: 'boolean' },
        createdBy: { type: 'string' },
        updatedBy: { type: 'string' },
    },
    required: [
        'auctioneerId',
        'productId',
        'initPrice',
        'createdBy',
        'updatedBy',
    ],
    additionalProperties: false,
};

module.exports = schema;