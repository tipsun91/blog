const UNAUTHENTICATED = 'unauthenticated';
const AUTHENTICATED   = 'authenticated';

const access = (role, status = 403) => {
  return (req, res, next) => {
    switch (role) {
      case AUTHENTICATED:
        if (res.locals.user) {
          next();
        } else {
          res.status(401).json({ message: 'Unauthorized!' });
        }
        return;
      case UNAUTHENTICATED:
        if (!res.locals.user) {
          next();
        } else {
          res.status(406).json({ message: 'Not acceptable!' });
        }
        return;
      default:
        res.status(status).end();
        return;
    }
  };
};

module.exports = {
  UNAUTHENTICATED,
  AUTHENTICATED,
  access,
};
