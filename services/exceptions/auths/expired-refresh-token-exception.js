const BaseServiceException = require('../bases/base-service-exception');

class ExpiredRefreshTokenException extends BaseServiceException {
    constructor() {
        super(`Refresh Token was expired.`, 401);
    }
}

module.exports = ExpiredRefreshTokenException