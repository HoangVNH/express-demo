const router = require('express').Router();
const asyncHandler = require('../handlers/async-handler');
const usersController = require('../controllers/users-controller');

router.route('/')
    .get(asyncHandler(usersController.getAllActiveAsync));
router.route('/:id')
    .get(asyncHandler(usersController.getActiveAsync));

module.exports = router;