const router = require('express').Router();
const asyncHandler = require('../handlers/async-handler');
const productsController = require('../controllers/products-controller');

router.route('/')
    .post(asyncHandler(productsController.createProductAsync))
    .get(asyncHandler(productsController.getAllProductAsync));
router.route('/topHighestBids').get(asyncHandler(productsController.topHighestBids));
router.route('/search').post(asyncHandler(productsController.searchProduct));
router.route('/topHighestBids').get(asyncHandler(productsController.topHighestBids));
router.route('/topProductNearEnd').get(asyncHandler(productsController.topProductNearEnd));
router.route('/:id')
    .get(asyncHandler(productsController.getProductAsync))
    .put(asyncHandler(productsController.updateProductAsync))
    .delete(asyncHandler(productsController.inactiveProductAsync));

module.exports = router;