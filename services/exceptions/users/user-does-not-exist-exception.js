const DataNotExistException = require('../data-not-exist-exception');

class UserDoesNotExistException extends DataNotExistException {
    constructor(userId) {
        super(userId);
    }
}

module.exports = UserDoesNotExistException