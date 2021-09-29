const router = require('express').Router();

router.use('/auths', require('./auths-router'));
router.use('/categories', require('./categories-router'));

module.exports = router;