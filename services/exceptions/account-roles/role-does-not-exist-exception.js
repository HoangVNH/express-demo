const BaseServiceException = require('../bases/base-service-exception');

class RoleDoesNotExistException extends BaseServiceException {
    constructor() {
        super(`Account was already verified.`);
    }
}

module.exports = RoleDoesNotExistException