// setup db connection, pass database name/users table name
module.exports = {
  'connection': {
    'connectionLimit' : 100, // no more than 100 concurrent connections
    'host'  : 'localhost',
    'user'  : 'testuser',
    'password'  : 'testpass'
  },
  'database'  : 'dill',
  'users_table' : 'users',
  'meals_table' : 'meals',
  'orders_table' : 'orders'
};
