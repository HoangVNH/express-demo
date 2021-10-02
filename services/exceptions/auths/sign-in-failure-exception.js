const BaseServiceException = require('../bases/base-service-exception');

class SignInFailureException extends BaseServiceException {
    constructor() {
        super(`Sign in was failed.`, 401);
    }
}

module.exports = SignInFailureException