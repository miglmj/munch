module.exports = function(app) {

  // Home Page
  app.get('/', function(req, res) {
    res.render('index');
  });

  // app.get('/login', function(req, res) {
  //   //render the page and pass any existing flash data
  //   res.render('login', { message: req.flash('loginMessage')});
  // });



}
