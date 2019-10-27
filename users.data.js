const users = [
    {
        name: 'Tom',
        role: 'developer',
        password: 'popcorn',
        email: 'tom@ing.com'
    },
    {
        name: 'Bob',
        role: 'manager',
        password: 'srspassword',
        email: 'bobbitybob@ing.com'
    },
    {
        name: 'Billy',
        role: 'admin',
        password: 'flag_part_1',
        email: 'billyzeadmin@ing.com'
    },
];

const findOne = email => {
    let res = null;
    users.forEach(user => {
      if (user.email == email) {
        res = user;
      }
    });
    return res;
};

module.exports = {
    users,
    findOne
};