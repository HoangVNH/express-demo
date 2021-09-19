const BaseServiceException = require('../bases/base-service-exception');

class InvalidOtpException extends BaseServiceException {
    constructor() {
        super(`OTP is invalid.`);
    }
}

module.exports = InvalidOtpException