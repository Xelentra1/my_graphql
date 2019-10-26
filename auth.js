const { AuthenticationError } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const { findOne } = require('./users.data');

const loggedIn = req => req.session.isAuth;

/**
 * Attempt to login
 */
const attemptLogin = (email, password) => {
  const message = 'Incorrect email or password. Please try again';
  const user = findOne(email);
  if (!user) throw new AuthenticationError(message);
  if (password !== user.password) throw new AuthenticationError(message);

  return user;
};

/**
 * Checks if the user is logged in
 */
const checkLoggedIn = req => {
  if (!loggedIn(req)) throw new AuthenticationError('Please sign in first!');
};

/**
 * Checks if the user is logged out
 */
const checkLoggedOut = req => {
  if (loggedIn(req)) throw new AuthenticationError('Please sign out first!');
};

const createTokensAndSetCookies = (user, res) => {
  const accessToken = jwt.sign({
    email: user.email,
    role: user.role
  },
  'weweadedrgrwe4axsdaw3we', {
    expiresIn: '1h'
  });

  const accessTokenExpirationTimerInt = 1000 * 60 * 60 * 1;

  res.cookie('access-token', accessToken, { maxAge: accessTokenExpirationTimerInt, httpOnly: true });
};

module.exports = {
  attemptLogin,
  checkLoggedIn,
  checkLoggedOut,
  createTokensAndSetCookies,
  findOne
};
