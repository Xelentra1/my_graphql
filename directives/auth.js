const { SchemaDirectiveVisitor } = require('apollo-server-express');
const { defaultFieldResolver } = require('graphql');

const { checkLoggedIn } = require('../auth.js');

class AuthDirective extends SchemaDirectiveVisitor {
  // eslint-disable-next-line class-methods-use-this
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = function checkAuth(...args) {
      const [, , context] = args;
      checkLoggedIn(context.req);
      return resolve.apply(this, args);
    };
  }
}

module.exports = AuthDirective;
