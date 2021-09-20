const BaseServiceException = require('../bases/base-service-exception');

class ExpiredOtpException extends BaseServiceException {
    constructor() {
        super(`OTP was already expired.`);
    }
}

module.exports = ExpiredOtpException