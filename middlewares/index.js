const loginValidation = (req, res, next) => {
  const ajv = new AJV();
  const isValid = ajv.validate(loginSchema, req.body);

  if (!isValid) {
      return res.status(400).json({
          message: 'Schema validation failed',
      });
  }

  next();
};

module.exports = {
  loginValidation
}