const router = require('express').Router();

router.use('/users', require('./users-router'));
router.use('/categories', require('./categories-router'));

module.exports = router;