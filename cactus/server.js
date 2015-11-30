/* Server file
    Set up view engine, routes,
    some middleware, etc.
*/

var express = require('express');
var path = require('path');
var routes = require('./routes/index');

// configuration for passport

// call expresss constructor
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap'));


// Use routes file for all requests
require('./routes/index')(app);

// catch 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('app listening at http://%s:%s', host, port);
});
