const categoriesService = require("../services/categories-service.js");
const { StatusCodes } = require('http-status-codes');

const categoriesController = {
    async createActiveAsync(req, res) {
        const requestBody = req.body;

        await categoriesService.createActiveAsync(
            requestBody.name,
            requestBody.parentId === undefined ? null : requestBody.parentId,
            requestBody.executedBy);

        res.send(StatusCodes.CREATED);
    },

    async getAllActiveAsync(req, res) {
        var result = await categoriesService.getAllActiveAsync();

        res.send(result);
    },

    async getActiveAsync(req, res) {
        var result = await categoriesService.getActiveAsync(req.params.id);

        res.send(result);
    },

    async updateActiveAsync(req, res) {
        const requestBody = req.body;

        await categoriesService.updateActiveAsync(req.params.id,
            requestBody.name);

        res.send(StatusCodes.NO_CONTENT);
    },

    async inactiveAsync(req, res) {
        await categoriesService.inactiveAsync(req.params.id);

        res.send(StatusCodes.NO_CONTENT);
    },
}

module.exports = categoriesController;