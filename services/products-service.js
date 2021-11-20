const productsRepository = require("../sequelize/models").Product;
const auctionsRepository = require("../sequelize/models").Auction;
const productsSubImageRepository = require("../sequelize/models").ProductSubImage;
const productsDescriptionRepository = require("../sequelize/models").ProductDescription;
const biddingLogRepository = require("../sequelize/models").BiddingLog;
const usersRepository = require("../sequelize/models").User;
const categoriesRepository = require("../sequelize/models").Category;
const usersRatingRepository = require("../sequelize/models").UserRating;
const { Op } = require("sequelize");
var Sequelize = require('sequelize');
const moment = require('moment');

const validateAndThrowExceptionHelper = require('../ajv/helpers/validate-and-throw-exception-helper');
const createProductSchema = require('../ajv/schemas/products/create-product-schema');
const createAuctionSchema = require('../ajv/schemas/products/create-auction-schema');
const createSubImageSchema = require('../ajv/schemas/products/create-sub-image-schema');
const createDescriptionSchema = require('../ajv/schemas/products/create-description-schema');
const UniqueConstraintViolatedException = require('./exceptions/unique-constraint-violated-exception');

const productsService = {
    async createProductAsync(categoryId, name, imageName, imagePath, executedBy) {
        var dataProduct = {
            categoryId: categoryId,
            name: name,
            imageName: imageName,
            imagePath: imagePath,
            isActive: true,
            createdBy: executedBy,
            updatedBy: executedBy,
        };

        validateAndThrowExceptionHelper(createProductSchema, dataProduct);

        var resultProduct = productsRepository.create(dataProduct);
        return resultProduct;
    },

    async createAuctionAsync(auctioneerId, productId, initPrice, stepPrice, isAllowNewBidder, endedAt, biddedBy, executedBy) {
        var dataAuction = {
            auctioneerId: auctioneerId,
            productId: productId,
            initPrice: initPrice,
            stepPrice: stepPrice,
            isAllowNewBidder: isAllowNewBidder,
            endedAt: endedAt,
            biddedBy: biddedBy,
            isActive: true,
            createdBy: executedBy,
            updatedBy: executedBy,
        };

        validateAndThrowExceptionHelper(createAuctionSchema, dataAuction);

        var resultAuction = auctionsRepository.create(dataAuction);

        return resultAuction;
    },

    async createproductSubImageAsync(productId, imageName2, imagePath2, executedBy) {
        var dataSubImage = {
            name: imageName2,
            productId: productId,
            imagePath: imagePath2,
            isActive: true,
            createdBy: executedBy,
            updatedBy: executedBy,
        };

        validateAndThrowExceptionHelper(createSubImageSchema, dataSubImage);

        var resultdataSubImage = productsSubImageRepository.create(dataSubImage);

        return resultdataSubImage;
    },

    async createproductDescriptionAsync(productId, description, executedBy) {
        var dataDescription = {
            description: description,
            productId: productId,
            isActive: true,
            createdBy: executedBy,
            updatedBy: executedBy,
        };

        validateAndThrowExceptionHelper(createDescriptionSchema, dataDescription);

        var resultdataDescription = productsDescriptionRepository.create(dataDescription);

        return resultdataDescription;
    },

    searchProduct(categoryId, product) {
        var result = categoriesRepository.findOne({
            attributes: ['parentId', 'name'],
            where: {
                isActive: true,
                id: categoryId
            },
            include: [
                {
                    model: productsRepository,
                    attributes: ['name', 'imageName', 'imagePath'],
                    where: {
                        isActive: true,
                        name: {
                            [Op.substring]: product
                        }
                    },
                    include: [
                        {
                            model: auctionsRepository,
                            attributes: ['initPrice', 'endedAt', 'auctioneerId', 'binPrice', 'createdAt'],
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
                                    include: [
                                        {
                                            model: usersRepository,
                                            where: {
                                                isActive: true,
                                            },
                                            required: false,

                                        }
                                    ]

                                }
                            ]
                        },

                    ],
                }
            ]
        });

        return result;
    },

    topProductNearEnd() {
        const currentDate = moment().toDate();
        var result = productsRepository.findAll({
            attributes: ['id', 'name', 'imageName', 'imagePath'],
            where: {
                isActive: true,
            },
            include: [
                {
                    model: auctionsRepository,
                    attributes: ['initPrice', 'endedAt', 'binPrice', 'createdAt'],
                    where: {
                        isActive: true,
                        endedAt: {
                            [Op.lt]: currentDate,
                        }
                    },
                    required: false,
                }
            ],
            order: [[auctionsRepository, 'endedAt', 'desc']]
        });

        return result;
    },

    topHighestPrice() {
        var result = productsRepository.findAll({
            attributes: ['id', 'name', 'imageName', 'imagePath'],
            where: {
                isActive: true,
            },
            include: [
                {
                    model: auctionsRepository,
                    attributes: ['initPrice', 'endedAt', 'binPrice', 'createdAt'],
                    where: {
                        isActive: true,
                    },
                    required: false,
                }
            ],
            // limit: 5,
            order: [[auctionsRepository, 'initPrice', 'desc']],
        });

        // var res = [];
        // result.forEach(element => {
        //     res.push(element);
        // });

        return result;
    },

    topHighestBids() {
        var result = productsRepository.findAll({
            attributes: ['id', 'name', 'imageName', 'imagePath'],
            where: {
                isActive: true,
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

    getAllProductAsync() {
        var result = productsRepository.findAll({
            attributes: ['id', 'name', 'imageName', 'imagePath'],
            where: {
                isActive: true,
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
                            include: [
                                {
                                    model: usersRepository,
                                    where: {
                                        isActive: true,
                                    },
                                    required: false,

                                }
                            ]

                        }
                    ]
                }
            ],
        });

        return result;
    },

    getProductAsync(id) {
        var result = categoriesRepository.findOne({
            attributes: ['parentId', 'name'],
            where: {
                isActive: true,
            },
            include: [
                {
                    model: productsRepository,
                    attributes: ['name', 'imageName', 'imagePath'],
                    where: {
                        isActive: true,
                        id: id,
                    },
                    include: [
                        {
                            model: auctionsRepository,
                            attributes: ['initPrice', 'endedAt', 'auctioneerId', 'binPrice', 'createdAt'],
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
                                    include: [
                                        {
                                            model: usersRepository,
                                            where: {
                                                isActive: true,
                                            },
                                            required: false,

                                        }
                                    ]

                                }
                            ]
                        },

                        {
                            model: productsSubImageRepository,
                            attributes: ['name', 'imagePath'],
                            where: {
                                isActive: true,
                            },
                            required: false
                        },
                        {
                            model: productsDescriptionRepository,
                            attributes: ['description'],
                            where: {
                                isActive: true,
                            },
                            required: false
                        },

                    ],
                }
            ]
        });

        // var result = productsRepository.findOne({
        //     attributes: ['name', 'imageName', 'imagePath'],
        //     where: {
        //         isActive: true,
        //         id: id,
        //     },
        //     include: [
        //         {
        //             model: auctionsRepository,
        //             attributes: ['initPrice', 'endedAt', 'auctioneerId', 'binPrice', 'createdAt'],
        //             where: {
        //                 isActive: true,
        //             },
        //             required: false,
        //             include: [
        //                 {
        //                     model: biddingLogRepository,
        //                     where: {
        //                         isActive: true,
        //                     },
        //                     required: false,
        //                     include: [
        //                         {
        //                             model: usersRepository,
        //                             where: {
        //                                 isActive: true,
        //                             },
        //                             required: false,

        //                         }
        //                     ]

        //                 }
        //             ]
        //         },

        //         {
        //             model: productsSubImageRepository,
        //             attributes: ['name', 'imagePath'],
        //             where: {
        //                 isActive: true,
        //             },
        //             required: false
        //         },
        //         {
        //             model: productsDescriptionRepository,
        //             attributes: ['description'],
        //             where: {
        //                 isActive: true,
        //             },
        //             required: false
        //         },

        //     ],
        // });

        return result;
    },

    updateProductAsync(id, name, initPrice, imageName, imagePath, imageName2, imagePath2, description, buyNowPrice,
        productPostDate, isAllowNewBidder, endedAt, minBiddingPrice, maxBiddingPrice, biddedBy) {
        var resultProduct = productsRepository.update({
            name: name,
            imageName: imageName,
            imagePath: imagePath
        }, {
            where: {
                isActive: true,
                id: id,
            }
        });

        var resultProductDescriptions = productsDescriptionRepository.update({
            description: description
        }, {
            where: {
                isActive: true,
                productId: id,
            }
        });

        var resultProductSubImage = productsSubImageRepository.update({
            name: imageName2,
            imagePath: imagePath2
        }, {
            where: {
                isActive: true,
                productId: id,
            }
        });

        var resultAuction = auctionsRepository.update({
            initPrice: initPrice,
            isAllowNewBidder: isAllowNewBidder,
            endedAt: endedAt,
            minBiddingPrice: minBiddingPrice,
            maxBiddingPrice: maxBiddingPrice,
            biddedBy: biddedBy
        }, {
            where: {
                isActive: true,
                productId: id,
            }
        });

        return resultAuction;
    },

    inactiveProductAsync(id) {
        var resultProduct = productsRepository.update(
            {
                isActive: false,
            },
            {
                where: {
                    isActive: true,
                    id: id
                },
            },
        );

        var resultAuction = auctionsRepository.update(
            {
                isActive: false,
            },
            {
                where: {
                    isActive: true,
                    productId: id
                },
            },
        );

        var resultProductSubImage = productsSubImageRepository.update(
            {
                isActive: false,
            },
            {
                where: {
                    isActive: true,
                    productId: id
                },
            },
        );

        var resultProductDescriptions = productsDescriptionRepository.update(
            {
                isActive: false,
            },
            {
                where: {
                    isActive: true,
                    productId: id
                },
            },
        );

        return resultAuction;
    },
};

module.exports = productsService;