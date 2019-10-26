const { ApolloError } = require('apollo-server-express');

const errorCodes = {
  EMAIL_ALREADY_EXISTS: {
    message: 'This email is already in use. Please provide an email that is not yet assigned to another user',
    code: 'EMAIL_ALREADY_EXISTS',
  },
  SOMETHING_WHENT_WRONG: {
    message: 'Something whent wrong',
    code: 'SOMETHING_WHENT_WRONG',
  },
  USER_NOT_FOUND: {
    message: 'The user(s) can not be found.',
    code: 'USER_NOT_FOUND',
  },
  NOT_AUTHENTICATED: {
    message: 'Authentication requered',
    code: 'NOT_AUTHENTICATED',
  },
  USER_IS_NOT_ADMIN: {
    message: 'You are not admin',
    code: 'USER_IS_NOT_ADMIN',
  },
};

/**
 * @param {object}
 * The error object with a code and message
 */
errorCodes.Error = object => {
  const error = new ApolloError();
  error.code = object.code;
  error.message = object.message;

  return error;
};

module.exports = errorCodes;
