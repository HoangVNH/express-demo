const { signIn } = require('../controllers/user.controller');
const { loginValidation } = require('../middlewares');
const router = require('express').Router();

router.post('/signin', loginValidation, signIn);

module.exports = router;
