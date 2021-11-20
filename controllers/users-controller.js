const usersService = require("../services/users-service.js");

const usersController = {
    async getAllActiveAsync(req, res) {
        var result = await usersService.getAllActiveAsync();

        res.send(result);
    },

    async getActiveAsync(req, res) {
        var result = await usersService.getActiveAsync(req.params.id);

        res.send(result);
    },
}

module.exports = usersController;