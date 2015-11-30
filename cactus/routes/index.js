module.exports = function(app) {

  // Home Page
  app.get('/', function(req, res) {
    res.render('index');
  });

  // Initial login page
  app.get('/login', function(req, res) {
    //render the page and pass any existing flash data
    res.render('login');
  });

  app.get('/signup', function(req, res) {
    res.render('signup');
  });

  app.get('/cook', function(req, res) {
    res.render('cook');
  });

};
