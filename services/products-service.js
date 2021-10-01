const productsRepository = require("../sequelize/models").Product;
const auctionsRepository = require("../sequelize/models").Auction;
const { Op } = require("sequelize");

const validateAndThrowExceptionHelper = require('../ajv/helpers/validate-and-throw-exception-helper');
const createProductSchema = require('../ajv/schemas/products/create-product-schema');
const createAuctionSchema = require('../ajv/schemas/products/create-auction-schema');
const UniqueConstraintViolatedException = require('./exceptions/unique-constraint-violated-exception');

const productsService = {
    async createProductAsync(categoryId, name, executedBy) {
        var dataProduct = {
            categoryId: categoryId,
            name: name,
            isActive: true,
            createdBy: executedBy,
            updatedBy: executedBy,
        };

        validateAndThrowExceptionHelper(createProductSchema, dataProduct);

        var resultProduct = productsRepository.create(dataProduct);

        return resultProduct;
    },

    async createAuctionAsync(auctioneerId, productId, initPrice, buyNowPrice, productPostDate, executedBy) {
        var dataAuction = {
            auctioneerId: auctioneerId,
            productId: productId,
            initPrice: initPrice,
            isActive: true,
            createdBy: executedBy,
            updatedBy: executedBy,
        };

        // validateAndThrowExceptionHelper(createAuctionSchema, dataAuction);

        var resultAuction = auctionsRepository.create(dataAuction);

        return resultAuction;
    },

    getAllProductAsync() {

        productsRepository.hasMany(auctionsRepository, { foreignKey: 'productId' })

        var result = productsRepository.findAll({
            attributes: ['id', 'categoryId', 'name', 'image'],
            where: {
                isActive: true,
            },
            include: [
                {
                    model: auctionsRepository,
                    attributes: ['initPrice',],
                    where: {
                        isActive: true,
                    },
                    required: false
                }
            ],
            required: false
        });

        return result;
    },

    // getActiveAsync(id) {
    //     var result = categoriesRepository.findOne({
    //         attributes: [
    //             'name',
    //         ],
    //         where: {
    //             isActive: true,
    //             id: id,
    //         },
    //     });

    //     return result;
    // },

    updateProductAsync(id, name, initPrice, buyNowPrice, productPostDate, isAllowNewBidder, endedAt, minBiddingPrice, maxBiddingPrice, biddedBy) {
        var resultProduct = productsRepository.update({
            name: name
        }, {
            where: {
                isActive: true,
                id: id,
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

        return resultAuction;
    },
};

// function getByNameAsync(name) {
//     var result = categoriesRepository.findOne({
//         where: {
//             name: name,
//         },
//     });

//     return result;
// };

module.exports = productsService;