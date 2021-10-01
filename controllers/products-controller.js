const productsService = require("../services/products-service");
const { StatusCodes } = require('http-status-codes');

const productsController = {
    async createProductAsync(req, res) {
        const requestBody = req.body;

        var product = await productsService.createProductAsync(
            //unprocessed image
            requestBody.categoryId,
            requestBody.name,
            requestBody.executedBy);

        var auction = await productsService.createAuctionAsync(
            requestBody.auctioneerId,
            product.id,
            requestBody.initPrice,
            requestBody.buyNowPrice,
            requestBody.productPostDate,
            requestBody.executedBy);

        res.status(StatusCodes.CREATED).send();
    },

    async getAllProductAsync(req, res) {
        var result = await productsService.getAllProductAsync();

        res.send(result);
    },

    // async getActiveAsync(req, res) {
    //     var result = await categoriesService.getActiveAsync(req.params.id);

    //     res.send(result);
    // },

    async updateProductAsync(req, res) {
        const requestBody = req.body;

        await productsService.updateProductAsync(
            //unprocessed image
            req.params.id,
            requestBody.name,
            requestBody.initPrice,
            requestBody.buyNowPrice,
            requestBody.productPostDate,
            requestBody.isAllowNewBidder,
            requestBody.endedAt,
            requestBody.minBiddingPrice,
            requestBody.maxBiddingPrice,
            requestBody.biddedBy);

        res.status(StatusCodes.NO_CONTENT).send();
    },

    async inactiveProductAsync(req, res) {
        await productsService.inactiveProductAsync(req.params.id);

        res.status(StatusCodes.NO_CONTENT).send();
    },
}

module.exports = productsController;