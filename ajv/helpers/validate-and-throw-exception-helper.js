const Ajv = require('ajv');
const addFormats = require("ajv-formats");
const ValidationFailedExceptionHelper = require('../exceptions/validation-failed-ajv-exception');
const ajv = new Ajv();
addFormats(ajv);

function validateAndThrowExceptionHelper(schema, data) {
    const validate = ajv.compile(schema);

    if (!validate(data)) {
        throw new ValidationFailedExceptionHelper(validate.errors);
    }
}

module.exports = validateAndThrowExceptionHelper;