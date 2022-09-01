const router = require('express').Router();
const bcrypt = require('bcrypt');
const {
  access,
  AUTHENTICATED,
  UNAUTHENTICATED,
} = require('../../middlewares/access');
const { User } = require('../../db/models');

function frontendUser(data) {
  return {
    data: [{
      id: data.id,
      email: data.email,
      name: data.name,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }],
  };
}

router
  .route('/out')
  .get(access(AUTHENTICATED), (req, res) => {
    req.session.destroy();
    res.clearCookie(process.env.SESSION_COOKIE);

    res.status(200).json({ status: 'success', message: 'Session destroyed!' });
  });

router
  .route('/in')
  .get(access(AUTHENTICATED), (req, res) => {
    if (req.session.userId && res.locals.user) {
      res.status(200).json(frontendUser(res.locals.user));
    } else {
      res.status(404).json({ status: 'error', message: 'Session not found!' });
    }
  })
  .post(access(UNAUTHENTICATED), async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.isExists(email);

      if (!user) {
        res.status(404).json({ status: 'error', message: 'User not found!' });
        return;
      }

      if (!(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ status: 'error', message: 'Incorrect password!' });
        return;
      }

      req.session.userId = user.id;

      res.status(200).json(frontendUser(user));
    } catch (e) {
      res.status(500).json({ status: 'error', message: e.message });
    }
  });

router
  .route('/up')
  .post(access(UNAUTHENTICATED), async (req, res) => {
    try {
      const { email, name, password, pswdcfrm } = req.body;

      if (!password || password !== pswdcfrm) {
        res.status(401).json({ status: 'error', message: 'Incorrect password!' });
        return;
      }

      if (await User.isExists(email)) {
        res.status(409).json({ status: 'error', message: 'User exists!' });
        return;
      }

      // Create User
      const hash = await bcrypt.hash(password, 2);
      const user = await User.create({
        email, name, password: hash,
      });
      await user.save();
      req.session.userId = user.id;

      res.status(200).json(frontendUser(user));
    } catch (error) {
      res.status(500).json({ status: 'error', message: e.message });
    }
  });

module.exports = router;
