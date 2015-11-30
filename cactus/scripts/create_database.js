/*
  Script to create db and tables for users, meals, and ratings
*/

var mysql = require('mysql');

// load db config variables
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection);

//create database
connection.query('CREATE DATABASE ' + dbconfig.database);
console.log('Success: Database Created!');

//create Users table
connection.query('\
CREATE TABLE ' + dbconfig.database + '.' + dbconfig.users_table + ' ( \
    id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    username VARCHAR(20) NOT NULL, \
    email VARCHAR(30) NOT NULL, \
    password CHAR(60) NOT NULL, \
        PRIMARY KEY (id), \
    UNIQUE INDEX username_UNIQUE (username), \
    UNIQUE INDEX email_UNIQUE (email) \
)');
console.log('Success: Users table created');

// create Meals table
connection.query('\
CREATE TABLE ' + dbconfig.database + '.' + dbconfig.meals_table + ' ( \
    id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    chefid INT UNSIGNED NOT NULL, \
    price DECIMAL(3,2) NOT NULL, \
    title VARCHAR(30) NOT NULL, \
    location VARCHAR(120) NOT NULL, \
    eatby DATETIME NOT NULL, \
      PRIMARY KEY(id), \
      FOREIGN KEY (chefid)  \
        REFERENCES ' + dbconfig.database + '.' + dbconfig.users_table + '(id)  \
        ON DELETE CASCADE \
)');
console.log('Success: Meals table created');

// create Ratings table
connection.query('\
CREATE TABLE ' + dbconfig.database + '.' + dbconfig.ratings_table + ' ( \
    id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    mealid INT UNSIGNED NOT NULL, \
    ratinguser INT UNSIGNED NOT NULL, \
    rating INT NOT NULL, \
    PRIMARY KEY(id), \
    FOREIGN KEY(mealid) \
      REFERENCES ' + dbconfig.database + '.' + dbconfig.meals_table +'(id) \
      ON DELETE CASCADE, \
    FOREIGN KEY(ratinguser) \
      REFERENCES ' + dbconfig.database + '.' + dbconfig.users_table +'(id) \
      ON DELETE CASCADE, \
      UNIQUE INDEX ratings_UNIQUE (mealid, ratinguser) \
)');
console.log('Success: Ratings table created');

connection.end();
