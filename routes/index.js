const router = require('express').Router();
const user = require('./user.router');

router.use('users', user);

module.exports = router;