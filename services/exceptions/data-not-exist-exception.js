const BaseServiceException = require('./bases/base-service-exception');

class DataNotExistException extends BaseServiceException {
    constructor(data) {
        super(`'${data}' does not exist`);
    }
}

module.exports = DataNotExistException