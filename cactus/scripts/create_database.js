/*
  Script to create db and tables for users, meals, and orders
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
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP, \
    eatby DATETIME NOT NULL, \
      PRIMARY KEY(id), \
      FOREIGN KEY (chefid)  \
        REFERENCES ' + dbconfig.database + '.' + dbconfig.users_table + '(id)  \
        ON DELETE CASCADE \
)');
console.log('Success: Meals table created');

// create Orders table
connection.query('\
CREATE TABLE ' + dbconfig.database + '.' + dbconfig.orders_table + ' ( \
    id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    mealid INT UNSIGNED NOT NULL, \
    custid INT UNSIGNED NOT NULL, \
    rating INT, \
    placed TIMESTAMP DEFAULT CURRENT_TIMESTAMP, \
    PRIMARY KEY(id), \
    FOREIGN KEY(mealid) \
      REFERENCES ' + dbconfig.database + '.' + dbconfig.meals_table +'(id) \
      ON DELETE CASCADE, \
    FOREIGN KEY(custid) \
      REFERENCES ' + dbconfig.database + '.' + dbconfig.users_table +'(id) \
      ON DELETE CASCADE, \
      UNIQUE INDEX orders_UNIQUE (mealid, custid) \
)');
console.log('Success: Orders table created');

connection.end();
