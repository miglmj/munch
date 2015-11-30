/* Server file
    Set up view engine, routes,
    some middleware, etc.
*/

var express = require('express');
var mysql = require('mysql');

var routes = require('./routes/index');

// call expresss constructor
var app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Use routes file for all requests
app.use('/', routes);

// catch 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = server;
