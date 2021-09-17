const usersController = require('../controllers/users-controller');
const { loginValidation } = require('../middlewares');
const router = require('express').Router();
const asyncHandler = require('../handlers/async-handler');

router.post('/signin', loginValidation, usersController.signIn)
    .post('/register', asyncHandler(usersController.registerAsync));

module.exports = router;
