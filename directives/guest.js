const { SchemaDirectiveVisitor } = require('apollo-server-express');
const { defaultFieldResolver } = require('graphql');

const { checkLoggedOut } = require('../auth.js');

class GuestDirective extends SchemaDirectiveVisitor {
  // eslint-disable-next-line class-methods-use-this
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = function checkGuest(...args) {
      const [, , context] = args;
      checkLoggedOut(context.req);
      return resolve.apply(this, args);
    };
  }
}

module.exports = GuestDirective;
