const authsController = require('../controllers/auths-controller');
const router = require('express').Router();
const asyncHandler = require('../handlers/async-handler');
const authenticationMiddleware = require('../middlewares/authentication-middleware');

router.post('/register', asyncHandler(authsController.registerNewBidderAsync))
    .get('/resend-otp/:email', asyncHandler(authsController.resendOTPAsync))
    .post('/verify', asyncHandler(authsController.verifyAsync))
    .post('/sign-in', asyncHandler(authsController.signInAsync))
    .post('/refresh-access-token', asyncHandler(authsController.refreshAccessTokenAsync));

router.post('/update-profile', authenticationMiddleware, asyncHandler(authsController.updateProfileAsync));

module.exports = router;
