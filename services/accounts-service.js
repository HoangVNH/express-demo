const repository = require("../sequelize/models").Account;
const createAccountForRegisteredUserSchema = require('../ajv/schemas/accounts/create-account-for-registered-user-schema');
const validateAndThrowExceptionHelper = require('../ajv/helpers/validate-and-throw-exception-helper');
const bcrypt = require('bcrypt');
const moment = require('moment');

const accountsService = {
    async createAccountForRegisteredUserAsync(userId, password, executedBy, transaction) {
        var account = {
            userId,
            password,
            isOtpVerified: false,
            isActive: true,
            createdBy: executedBy,
            updatedBy: executedBy,
        };

        validateAndThrowExceptionHelper(createAccountForRegisteredUserSchema,
            account);

        const saltRounds = 10;

        // Hashing Password
        account.password = await bcrypt.hash(account.password, saltRounds);

        // Generating random OTP
        const randomOtp = Math.floor(Math.random() * Math.floor(999999));

        // Hashing OTP
        account.otp = await bcrypt.hash(randomOtp.toString(), saltRounds);

        // Set OTP expiry date
        const now = new moment();
        account.otpExpiryDate = now.add(5, 'm').toDate();

        // Store in DB
        const result = await repository.create(account, { transaction });
        result.otp = randomOtp;

        return result;
    },
};

module.exports = accountsService;