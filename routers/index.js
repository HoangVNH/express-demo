const router = require('express').Router();

router.use('/auths', require('./auths-router'));
router.use('/categories', require('./categories-router'));
router.use('/products', require('./products-router'));

module.exports = router;