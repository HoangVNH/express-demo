const BaseServiceException = require('./bases/base-service-exception');

class UniqueConstraintViolatedException extends BaseServiceException {
    constructor(violatedValue) {
        super(`Unique constraint violated. Value '${violatedValue}' is already exist.`);
    }
}

module.exports = UniqueConstraintViolatedException