/* Server file
    Set up view engine, routes,
    some middleware, etc.
*/

var express = require('express');
var path = require('path');
var routes = require('./routes/index');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var flash = require('connect-flash');

// call expresss constructor
var app = express();

app.use(morgan('dev')); // log requests
app.use(cookieParser()); // read cookies for auth using passport-local
app.use(bodyParser.json()); // read html form contents
app.use(bodyParser.urlencoded({ extended: true }));

require('./config/passport')(passport); //pass passport object to config file

// session secret for passport
app.use(session({
  secret: 'iknowwhenthathotlinebling'
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent sessions
app.use(flash()); //use connect-flash for flash messages


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap'));


// Use routes file for all requests
require('./routes/index')(app, passport);

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
