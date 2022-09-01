const router = require('express').Router();
const path = require('path');

router.use('/api', require('./api/index'));

router.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

module.exports = router;
