// configuration settings for passport.js

var LocalStrategy = require('passport-local').Strategy;

// database libraries
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

// set database to be used
connection.query('USE ' + dbconfig.database);

module.exports = function(passport) {

  // passport session setup
  // passport needs function to serialize (get id value from user object) and deserialize (get user object from id) users

  passport.serializeUser(function(user, done) {
      done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
      connection.query("SELECT * FROM users WHERE id = ? ",[id], function(err, rows){
          done(err, rows[0]);
      });
  });

  // local sign up
  // initialize strategy
  passport.use(
    'local-signup',
    new LocalStrategy({
      passReqToCallback : true // so that the callback function can receive the entire request object
    },
    function(req, username, password, done) {

      // check if username is already in db
      connection.query("SELECT * FROM " + dbconfig.users_table + " WHERE username = ?", [username], function(err, rows) {
        if (err)
          return done(err);
        if (rows.length) {
          return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
        }


        else {
          // (hopefully) check if email is already taken
          connection.query("SELECT * FROM " + dbconfig.users_table + " WHERE email = ?", [req.body.email], function(err, rows){
            if (err)
              return done(err);
            if (rows.length) {
              return done(null, false, req.flash('signupMessage', 'That email has already been registered.'));
            }
            else {
              //if neither the username or email is taken, create the user and insert into the database
              var newUser = {
                username: username,
                email: req.body.email,
                password: bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
              };

              var insertQuery = "INSERT INTO " + dbconfig.users_table + "(username, email, password) values (?,?,?)";
              connection.query(insertQuery, [newUser.username, newUser.email, newUser.password], function(err, rows) {
                newUser.id = rows.insertId;

                return done(null, newUser);
              });
            }
          });
        }


      });
    })
  );

  // local login
  passport.use(
    'local-login',
    new LocalStrategy({
      passReqToCallback : true
    },
    function(req, username, password, done) {
      connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){
          if (err)
              return done(err);
          if (!rows.length) {
              return done(null, false, req.flash('loginMessage', 'No user found.'));
          }

          // if the user is found but the password is wrong
          if (!bcrypt.compareSync(password, rows[0].password))
              return done(null, false, req.flash('loginMessage', 'Wrong password.'));

          // all is well, return successful user
          return done(null, rows[0]);
      });
    })
  );
};
