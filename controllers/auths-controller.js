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

    async signInAsync(req, res) {
        const { email, password } = req.body;

        const result = await authsService.signInAndGenerateTokensAsync(
            email, password);

        res.status(StatusCodes.OK).send(result);
    },
};

module.exports = authsController;