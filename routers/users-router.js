const usersController = require('../controllers/users-controller');
const { loginValidation } = require('../middlewares');
const router = require('express').Router();
const asyncHandler = require('../handlers/async-handler');

router.post('/register', asyncHandler(usersController.registerAsync))
    .get('/resend-otp/:email', asyncHandler(usersController.resendOTPAsync))
    .post('/verify', asyncHandler(usersController.verifyAsync))
    .post('/signin', loginValidation, usersController.signIn);

module.exports = router;
