const jwt = require('jsonwebtoken');

const setAuth = (req, decodedToken, next) => {
  req.session.isAuth = true;
  req.session.email = decodedToken.email;
  req.session.role = decodedToken.role;
  return next();
};

const setNotAuth = (req, next) => {
  req.session.isAuth = false;
  delete req.session.email;
  delete req.session.role;
  return next();
};

const isAuth = async (req, res, next) => {
  if (!req.session) {
    req.session = {};
  }

  let accessTokenCookie = '';
  let refreshTokenCookie = '';

  if (req.cookies) {
    accessTokenCookie = req.cookies['access-token'];
  }

  if (!accessTokenCookie && !refreshTokenCookie) {
    return setNotAuth(req, next);
  }

  let decodedAccessToken;
  try {
    decodedAccessToken = jwt.verify(accessTokenCookie, 'weweadedrgrwe4axsdaw3we');
    return setAuth(req, decodedAccessToken, next);
  } catch (err) {
    console.log(err);
  }

  return setNotAuth(req, next);;
};

module.exports = {
  isAuth
};
