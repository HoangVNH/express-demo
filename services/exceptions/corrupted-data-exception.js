const BaseServiceException = require('./bases/base-service-exception');

class CorruptedDataException extends BaseServiceException {
    constructor() {
        super(`Data was corrupted.`);
    }
}

module.exports = CorruptedDataException