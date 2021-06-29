const { signIn } = require('../Controller/user.controller');
const { loginValidation } = require('../Middleware');
const router = require('express').Router();

router.post('/signin', loginValidation, signIn);

module.exports = router;
