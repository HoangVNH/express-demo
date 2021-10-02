const router = require('express').Router();

router.use('/categories', require('./categories-router'));
router.use('/products', require('./products-router'));

module.exports = router;