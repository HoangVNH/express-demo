const BaseServiceException = require('../bases/base-service-exception');

class InvalidAccessTokenException extends BaseServiceException {
    constructor() {
        super(`Access Token is invalid.`);
    }
}

module.exports = InvalidAccessTokenException