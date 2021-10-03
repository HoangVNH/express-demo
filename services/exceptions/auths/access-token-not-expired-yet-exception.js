const BaseServiceException = require('../bases/base-service-exception');

class AccessTokenNotExpiredYetException extends BaseServiceException {
    constructor() {
        super(`Access Token was not expired yet.`);
    }
}

module.exports = AccessTokenNotExpiredYetException