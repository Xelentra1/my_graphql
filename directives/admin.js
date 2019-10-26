const { SchemaDirectiveVisitor } = require('apollo-server-express');
const { defaultFieldResolver } = require('graphql');
const errors = require('../errors');


class AdminDirective extends SchemaDirectiveVisitor {
  checkAdmin(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = (...args) => {
      const [, , context] = args;
      if (!context.req.session || !context.req.session.role || context.req.session.role !== "admin") {
        throw errors.Error(errors.USER_IS_NOT_ADMIN);
      }
      return resolve.apply(this, args);
    };
  }

  // eslint-disable-next-line class-methods-use-this
  visitFieldDefinition(field) {
    this.checkAdmin(field);
  }

  // eslint-disable-next-line class-methods-use-this
  visitInputFieldDefinition(field) {
    this.checkAdmin(field);
  }
}

module.exports = AdminDirective;
