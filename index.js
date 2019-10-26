const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const schemaDirectives = require('./directives');
const { isAuth } = require('./middleware/is_auth');
const cookieParser = require('cookie-parser');
const { createServer } = require('http');
const { attemptLogin, createTokensAndSetCookies } = require('./auth');
const { users, findOne } = require('./users.data');

const typeDefs = gql`
    directive @auth on FIELD_DEFINITION
    directive @guest on FIELD_DEFINITION
    directive @admin on FIELD | FIELD_DEFINITION | INPUT_FIELD_DEFINITION

    type User {
        name: String
        role: String
        password: String @admin
        email: String
    }    

    input UserUpdateInput {
        name: String
        role: String
        email: String @admin
    }

    type Query {
        users: [User] @auth @admin
    }

    type Mutation {
        register(email: String, name: String, password: String): User @guest
        login(email: String!, password: String!): User @guest
        logout: Boolean @auth

        updateUser(email: String, user: UserUpdateInput): User @auth
    }
`;

const register =  (root, args) => {
    const existingUser = findOne(args.email);
    if (existingUser) {
        throw errors.Error(errors.EMAIL_ALREADY_EXISTS);
    }
    const user = args;
    user.role = "guest";
    users.push(user);
    return user;
  };

const login = (root, args, { res }) => {
    const user = attemptLogin(args.email, args.password);
    createTokensAndSetCookies(user, res);
    return user;
};

const logout = (root, args, { req, res }) => {
    res.clearCookie('access-token');
    res.clearCookie('refresh-token');
    return true;
};

const updateUser = (root, { user, email }, { req }) => {
    const isAdmin = req.session && req.session.role && req.session.role == "admin";
    if (!isAdmin && req.session.email !== email) {
        throw errors.Error(errors.USER_IS_NOT_ADMIN);
    }
    const foundUser = findOne(email);
    if (user.email && isAdmin) foundUser.email = user.email;
    if (user.role) foundUser.role = user.role;
    if (user.name) foundUser.name = user.name;
    return foundUser;
};
  
const resolvers = {
    Query: {
        users: () => users
    },
    Mutation: {
        register,
        login,
        logout,
        updateUser
    }
};

const Server = express();
Server.disable('x-powered-by');

Server.use(require('cors')({
    origin: [
      'http://localhost:3000',
      'https://localhost:3000',
    ],
}));

// Setup jwt auth
Server.use(cookieParser());
Server.use(isAuth);

const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives,
    playground: {
        settings: {
          'request.credentials': 'include',
        }
    },
    context: ({ req, res }) => ({ req, res })
});

apollo.applyMiddleware({
    app: Server,
    cors: {
      credentials: true,
      origin: ['http://localhost:3000']
    }
  });


const httpServer = createServer(Server);
apollo.installSubscriptionHandlers(httpServer);


httpServer.listen(8080)
console.log(`🚀 server ready at port 8080 \n`);

