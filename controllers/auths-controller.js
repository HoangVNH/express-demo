const { userServiceFactory } = require('../services/user.service');
const authsService = require('../services/auths-service');
const { StatusCodes } = require('http-status-codes');

const TooManyRequestResendOTPException = require('../services/exceptions/accounts/too-many-request-resend-otp-exception');

const authsController = {
    async registerNewBidderAsync(req, res) {
        const { firstName, lastName, email, address, password, executedBy } = req.body;

        await authsService.registerNewBidderUserAsync(
            firstName,
            lastName,
            email,
            address,
            password,
            executedBy);

        res.status(StatusCodes.CREATED).send();
    },

    async resendOTPAsync(req, res) {
        try {
            await authsService.resendOTPAsync(
                req.params.email);

            res.status(StatusCodes.ACCEPTED).send();
        } catch (error) {
            if (error instanceof TooManyRequestResendOTPException) {
                res.status(StatusCodes.TOO_MANY_REQUESTS).send();
            }
            else {
                throw error;
            }
        }
    },

    async verifyAsync(req, res) {
        const { email, otp } = req.body;

        await authsService.verifyAsync(
            email,
            Number(otp));

        res.status(StatusCodes.NO_CONTENT).send();
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

module.exports = authsController;