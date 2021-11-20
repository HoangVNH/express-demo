const router = require('express').Router();
const authorizationsMiddleware = require('../middlewares/authorizations-middleware');

router.use('/categories', require('./categories-router'));
router.use('/products', require('./products-router'));
router.use('/users', authorizationsMiddleware.checkRoleAdmin, require('./users-router'));

module.exports = router;