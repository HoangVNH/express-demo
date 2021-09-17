const router = require('express').Router();
const asyncHandler = require('../handlers/async-handler');
const categoriesController = require('../controllers/categories-controller');

router.route('/')
    .post(asyncHandler(categoriesController.createActiveAsync))
    .get(asyncHandler(categoriesController.getAllActiveAsync));
router.route('/:id')
    .get(asyncHandler(categoriesController.getActiveAsync))
    .put(asyncHandler(categoriesController.updateActiveAsync))
    .delete(asyncHandler(categoriesController.inactiveAsync));

module.exports = router;