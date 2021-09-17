const { userServiceFactory } = require('../services/user.service');
const usersService = require('../services/users-service');

const usersController = {
    async registerAsync(req, res) {
        const requestBody = req.body;

        await usersService.registerAsync(
            requestBody.firstName,
            requestBody.lastName,
            requestBody.email,
            requestBody.address,
            requestBody.password,
            requestBody.executedBy);

        // TODO: return status code 201
        res.send();
    },

    async signIn(req, res, next) {
        const { email, password } = req.body;
        try {
            const uow = await getUnitOfWork(HAS_TRANSACTION.NO);
            const UserService = userServiceFactory(uow);
            const userServices = new UserService();
            const data = await userServices.signIn(email, password);
            await uow.release();
            return res.status(data.statusCode).json(data);
        } catch (error) {
            return next(errorHandler(500, "error", error));
        }
    },
};

module.exports = usersController;