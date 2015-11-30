// config/database.js
module.exports = {
    'connection': {
      'connectionLimit' : 100, //important
      'host'     : 'localhost',
      'user'     : 'testuser',
      'password' : 'testpass'
    },
	'database': 'bamboo',
    'users_table': 'users'
};
