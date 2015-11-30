// setup db connection, pass database name/users table name
module.exports = {
  'connection': {
    'connectionLimit' : 100, // no more than 100 concurrent connections
    'host'  : 'localhost',
    'user'  : 'testuser',
    'password'  : 'testpass'
  },
  'database'  : 'cactus',
  'users_table' : 'users',
  'meals_table' : 'meals',
  'ratings_table' : 'ratings'
};
