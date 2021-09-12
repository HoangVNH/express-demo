const ValidationFailedAjvException = require('../ajv/exceptions/validation-failed-ajv-exception');
const BaseServiceException = require('../services/exceptions/bases/base-service-exception');

const exceptionHandlerMiddleware = (err, req, res, next) => {
    if (err instanceof ValidationFailedAjvException) {
        res.status(err.status)
            .json(err.errors.map((item) => {
                return {
                    instancePath: item.instancePath,
                    keyword: item.keyword,
                    params: item.params,
                    message: item.message,
                }
            }));
    } else if (err instanceof BaseServiceException) {
        res.status(err.status || 400)
            .json(err.error);
    } else {
        res.status(err.status || 500)
            .json({
                message: err.message,
                stack: err.stack,
                error: err,
            });
    }
};

module.exports = exceptionHandlerMiddleware;