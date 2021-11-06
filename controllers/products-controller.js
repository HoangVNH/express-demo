const productsService = require("../services/products-service");
const biddingService = require("../services/bidding-service");
const { StatusCodes } = require('http-status-codes');

const productsController = {
    async createProductAsync(req, res) {
        const requestBody = req.body;

        // if (!req.files)
        //     return res.status(400).send('No files image');
        // var file = req.files.uploaded_image;
        // var img_name = file.name;
        // filePath = 'images/upload/' + file.name;

        // file.mv(filePath, function (err) {
        //     if (err)
        //         return res.status(500).send(err);
        // });

        var product = await productsService.createProductAsync(
            requestBody.categoryId,
            requestBody.name,
            requestBody.imageName,
            requestBody.imagePath,
            requestBody.executedBy);
        // req.claims.uid);

        var auction = await productsService.createAuctionAsync(
            requestBody.auctioneerId,
            product.id,
            requestBody.initPrice,
            requestBody.stepPrice,
            requestBody.isAllowNewBidder,
            requestBody.endedAt,
            requestBody.biddedBy,
            requestBody.executedBy);
        // req.claims.uid);

        var productSubImage = await productsService.createproductSubImageAsync(
            product.id,
            requestBody.imageName2,
            requestBody.imagePath2,
            requestBody.executedBy);
        // req.claims.uid);

        var productDescription = await productsService.createproductDescriptionAsync(
            product.id,
            requestBody.description,
            requestBody.executedBy);
        // req.claims.uid);


        res.status(StatusCodes.CREATED).send();
    },

    async getAllProductAsync(req, res) {
        var result = await productsService.getAllProductAsync();

        res.send(result);
    },

    async getProductAsync(req, res) {
        var result = await productsService.getProductAsync(req.params.id);

        res.send(result);
    },

    async topProductNearEnd(req, res) {
        var result = await productsService.topProductNearEnd();
        var ret = [];
        for (let i = 0; i < 5; i++) {
            ret.push(result[i]);
        }
        res.send(result);
    },

    async topHighestPrice(req, res) {
        var result = await productsService.topHighestPrice();
        var ret = [];
        for (let i = 0; i < 5; i++) {
            ret.push(result[i]);
        }

        res.send(ret);
    },
    async topHighestBids(req, res) {
        var result = await biddingService.getCurrentBidder();
        var ret = [];
        for (let i = 0; i < 5; i++) {
            ret.push(result[i]);
        }
        res.send(result);
    },

    async updateProductAsync(req, res) {
        const requestBody = req.body;

        await productsService.updateProductAsync(
            //unprocessed image
            req.params.id,
            requestBody.name,
            requestBody.initPrice,
            requestBody.imageName,
            requestBody.imagePath,
            requestBody.imageName2,
            requestBody.imagePath2,
            requestBody.description,
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