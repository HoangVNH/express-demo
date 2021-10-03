const authsController = require('../controllers/auths-controller');
const router = require('express').Router();
const asyncHandler = require('../handlers/async-handler');

router.post('/register', asyncHandler(authsController.registerNewBidderAsync))
    .get('/resend-otp/:email', asyncHandler(authsController.resendOTPAsync))
    .post('/verify', asyncHandler(authsController.verifyAsync))
    .post('/sign-in', asyncHandler(authsController.signInAsync))
    .post('/refresh-access-token', asyncHandler(authsController.refreshAccessTokenAsync));

module.exports = router;
