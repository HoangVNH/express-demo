const categoriesService = require("../services/categories-service.js");

const categoriesController = {
    async createActiveAsync(req, res) {
        const requestBody = req.body;

        await categoriesService.createActiveAsync(
            requestBody.name,
            requestBody.parentId === undefined ? null : requestBody.parentId,
            requestBody.executedBy);

        res.send();
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

        res.send();
    },

    async inactiveAsync(req, res) {
        await categoriesService.inactiveAsync(req.params.id);

        res.send();
    },
}

module.exports = categoriesController;