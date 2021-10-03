const BaseServiceException = require('../bases/base-service-exception');

class InvalidRefreshTokenException extends BaseServiceException {
    constructor() {
        super(`Refresh Token is invalid.`);
    }
}

module.exports = InvalidRefreshTokenException