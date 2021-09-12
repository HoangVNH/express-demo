const router = require('express').Router();
const user = require('./user.router');

router.use('/users', user);
router.use('/categories', require('./categories-router'));

module.exports = router;