const router = require('express').Router();
const user = require('./user.router');

router.use('/api/users', user);

module.export = router;