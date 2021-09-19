const BaseServiceException = require('../bases/base-service-exception');

class AlreadyVerifiedAccountException extends BaseServiceException {
    constructor() {
        super(`Account was already verified.`);
    }
}

module.exports = AlreadyVerifiedAccountException