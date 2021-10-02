const ValidationFailedAjvException = require('../ajv/exceptions/validation-failed-ajv-exception');
const BaseServiceException = require('../services/exceptions/bases/base-service-exception');

const exceptionHandlerMiddleware = (err, req, res, next) => {
    const env = process.env.NODE_ENV || 'development';
    const isDevelopment = env === 'development';

    if (isDevelopment) {
        if (err instanceof ValidationFailedAjvException) {
            res.status(err.status)
                .json(err.errors.map((item) => {
                    return {
                        name: err.name,
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
    } else {
        res.status(err.status)
            .json({
                name: err.name,
                message: err.message,
            });
    }
};

module.exports = exceptionHandlerMiddleware;