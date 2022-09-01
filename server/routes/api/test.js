const router = require('express').Router();

router
  .route('/')
  .get((req, res) => {
    res.end('Hello world!');
  });

module.exports = router;
