const AuthDirective = require('./auth.js');
const GuestDirective = require('./guest.js');
const AdminDirective = require('./admin.js');

module.exports = {
  auth: AuthDirective,
  guest: GuestDirective,
  admin: AdminDirective
};
