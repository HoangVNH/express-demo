const productsService = require("../services/products-service");
const { StatusCodes } = require('http-status-codes');

const productsController = {
    async createProductAsync(req, res) {
        const requestBody = req.body;

        if (!req.files)
            return res.status(400).send('No files image');
        var file = req.files.uploaded_image;
        var img_name = file.name;
        filePath = 'images/upload/' + file.name;

        file.mv(filePath, function (err) {
            if (err)
                return res.status(500).send(err);
        });

        var product = await productsService.createProductAsync(
            requestBody.categoryId,
            requestBody.img_name,
            requestBody.imageName,
            requestBody.filePath,
            req.claims.uid);

        var auction = await productsService.createAuctionAsync(
            requestBody.auctioneerId,
            product.id,
            requestBody.initPrice,
            requestBody.buyNowPrice,
            requestBody.productPostDate,
            req.claims.uid);

        var productSubImage = await productsService.createproductSubImageAsync(
            product.id,
            requestBody.imageName2,
            requestBody.imagePath2,
            req.claims.uid);

        var productDescription = await productsService.createproductDescriptionAsync(
            product.id,
            requestBody.description,
            req.claims.uid);


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