const repository = require("../sequelize/models").Account;
const createAccountForRegisteredUserSchema = require('../ajv/schemas/accounts/create-account-for-registered-user-schema');
const validateAndThrowExceptionHelper = require('../ajv/helpers/validate-and-throw-exception-helper');
const bcrypt = require('bcrypt');
const moment = require('moment');

const CorruptedDataException = require('./exceptions/corrupted-data-exception');
const AlreadyVerifiedAccountException = require('./exceptions/accounts/already-verfied-account-exception');
const ExpiredOtpException = require('./exceptions/accounts/expired-otp-exception');
const InvalidOtpException = require('./exceptions/accounts/invalid-otp-exception');
const TooManyRequestResendOTPException = require('./exceptions/accounts/too-many-request-resend-otp-exception');

const accountsService = {
    async createAccountAsync(userId, password, transaction) {
        const result = await createAsync(userId, password, transaction);

        return result;
    },

    async requestToResendOTPAsync(account, transaction) {
        const result = account;
        if (result === null || result.isActive === false) {
            throw new CorruptedDataException();
        } else if (result.isOtpVerified) {
            throw new AlreadyVerifiedAccountException();
        }

        const executedAt = new moment().toDate();
        if (result.otpResendDate > executedAt) {
            throw new TooManyRequestResendOTPException();
        }

        if (result.otpExpiryDate < executedAt) {
            // Create new OTP
            result.otp = generateOTP();
            result.otpExpiryDate = generateOTPExpiryDate();
        }

        result.otpResendDate = generateOTPResendDate();

        // Store in DB
        result.save({ transaction });

        return result;
    },

    async verifyAsync(account, otp) {
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

        if (result.otp !== otp) {
            throw new InvalidOtpException();
        }

        result.isOtpVerified = true;
        result.save();

        return result;
    },
};

const SALT_ROUNDS = 10;

async function createAsync(userId, password, transaction) {
    var account = {
        accountId: userId,
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

    // Generating random OTP & OTP expiry date
    account.otp = generateOTP();
    account.otpExpiryDate = generateOTPExpiryDate();
    account.otpResendDate = generateOTPResendDate();

    // Store in DB
    const result = await repository.create(account, { transaction });

    return result;
};

function generateOTP() {
    min = Math.ceil(100000);
    max = Math.floor(999999);
    const result = Math.floor(Math.random() * (max - min + 1) + min);

    return result;
}

function generateOTPExpiryDate() {
    const now = new moment();
    const result = now.add(5, 'm').toDate();

    return result
}

function generateOTPResendDate() {
    const now = new moment();
    const result = now.add(2, 'm').toDate();

    return result;
}

module.exports = accountsService;
