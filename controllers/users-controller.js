const { userServiceFactory } = require('../services/user.service');
const usersService = require('../services/users-service');
const { StatusCodes } = require('http-status-codes');

const usersController = {
    async registerAsync(req, res) {
        const { firstName, lastName, email, address, password, executedBy } = req.body;

        await usersService.registerAsync(
            firstName,
            lastName,
            email,
            address,
            password,
            executedBy);

        res.send(StatusCodes.CREATED);
    },

    async verifyAsync(req, res) {
        const { email, otp } = req.body;

        await usersService.verifyAsync(
            email,
            otp);

        res.send(StatusCodes.NO_CONTENT);
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