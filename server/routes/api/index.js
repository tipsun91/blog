const router = require('express').Router();

router.use('/sign', require('./sign'));
router.use('/post', require('./post'));
router.use('/comment', require('./comment'));
router.use('/test', require('./test'));

module.exports = router;
