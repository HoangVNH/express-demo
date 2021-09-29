const authsController = require('../controllers/auths-controller');
const { loginValidation } = require('../middlewares');
const router = require('express').Router();
const asyncHandler = require('../handlers/async-handler');

router.post('/register', asyncHandler(authsController.registerNewBidderAsync))
    .get('/resend-otp/:email', asyncHandler(authsController.resendOTPAsync))
    .post('/verify', asyncHandler(authsController.verifyAsync))
    .post('/signin', loginValidation, authsController.signIn);

module.exports = router;
