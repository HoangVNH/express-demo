const productsRepository = require("../sequelize/models").Product;
const auctionsRepository = require("../sequelize/models").Auction;
const biddingLogRepository = require("../sequelize/models").BiddingLog;

const biddingsService = {
    async getCurrentBidder(productId) {
        var result = productsRepository.findAll({
            attributes: ['id', 'name', 'imageName', 'imagePath'],
            where: {
                isActive: true,
                id: productId
            },
            include: [
                {
                    model: auctionsRepository,
                    attributes: ['initPrice', 'endedAt', 'binPrice', 'createdAt'],
                    where: {
                        isActive: true,
                    },
                    required: false,
                    include: [
                        {
                            model: biddingLogRepository,
                            where: {
                                isActive: true,
                            },
                            required: false,

                        }
                    ]
                }
            ],
            limit: 5,
            order: [[sequelize.fn('sum', 'biddinglogs.bidderId'), 'DESC']],
            group: ['biddinglogs.auctionId'],
        });

        return result;
    },
};

module.exports = biddingsService;