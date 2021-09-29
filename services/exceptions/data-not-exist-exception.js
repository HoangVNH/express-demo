const BaseServiceException = require('./bases/base-service-exception');

class DataNotExistException extends BaseServiceException {
    constructor(data) {
        super(`${data} deoes`);
    }
}

module.exports = DataNotExistException