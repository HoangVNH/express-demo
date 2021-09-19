const repository = require("../sequelize/models").Account;
const createAccountForRegisteredUserSchema = require('../ajv/schemas/accounts/create-account-for-registered-user-schema');
const validateAndThrowExceptionHelper = require('../ajv/helpers/validate-and-throw-exception-helper');
const bcrypt = require('bcrypt');
const moment = require('moment');

const CorruptedDataException = require('./exceptions/corrupted-data-exception');
const AlreadyVerifiedAccountException = require('./exceptions/users/already-verfied-account-exception');
const ExpiredOtpException = require('./exceptions/users/expired-otp-exception');
const InvalidOtpException = require('./exceptions/users/invalid-otp-exception');

const accountsService = {
    async createAccountForRegisteredUserAsync(userId, password, transaction) {
        var account = {
            userId,
            password,
            isOtpVerified: false,
            isActive: true,
            createdBy: userId,
            updatedBy: userId,
        };

        validateAndThrowExceptionHelper(createAccountForRegisteredUserSchema,
            account);

        // Hashing Password
        account.password = await bcrypt.hash(account.password, SALT_ROUNDS);

        // Generating random OTP
        const randomOtp = Math.floor(Math.random() * Math.floor(999999));

        // Hashing OTP
        account.otp = await bcrypt.hash(randomOtp.toString(), SALT_ROUNDS);

        // Set OTP expiry date
        const now = new moment();
        account.otpExpiryDate = now.add(5, 'm').toDate();

        // Store in DB
        const result = await repository.create(account, { transaction });
        result.otp = randomOtp;

        return result;
    },

    async verifyAsync(account, plainOtp) {
        const result = account;
        if (result === null || result.isActive === false) {
            throw new CorruptedDataException();
        } else if (result.isOtpVerified) {
            throw new AlreadyVerifiedAccountException();
        }

        const executedAt = new moment().toDate();
        if (result.otpExpiryDate < executedAt) {
            throw new ExpiredOtpException();
        }

        const isOtpVerified = await bcrypt.compare(plainOtp.toString(), result.otp);
        if (isOtpVerified === false) {
            throw new InvalidOtpException();
        }

        result.isOtpVerified = isOtpVerified;
        result.save();

        return result;
    },
};

const SALT_ROUNDS = 10;

module.exports = accountsService;