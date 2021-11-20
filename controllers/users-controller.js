const usersService = require("../services/users-service.js");

const usersController = {
    async getAllActiveAsync(req, res) {
        var result = await usersService.getAllActiveAsync();

        res.send(result);
    },
}

module.exports = usersController;