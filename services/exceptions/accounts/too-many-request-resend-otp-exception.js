const BaseServiceException = require('../bases/base-service-exception');

class TooManyRequestResendOTPException extends BaseServiceException {
    constructor() {
        super(`Too many request to resend OTP.`);
    }
}

module.exports = TooManyRequestResendOTPException