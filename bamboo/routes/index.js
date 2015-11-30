module.exports = function(app, passport) {

  // Home Page
  app.get('/', function(req, res) {
    res.render('index');
  });

  app.get('/login', function(req, res) {
    //render the page and pass any existing flash data
    res.render('login', { message: req.flash('loginMessage')});
  });

  app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/cook',
            failureRedirect : '/login',
            failureFlash  : true
            }),
        function(req, res) {
          console.log("hello");

          if(req.body.remember) {
            req.session.cookie.maxAge = 1000 * 60 * 3;
          } else {
            req.session.cookie.expires = false;
          }
          res.redirect('/');
  });

  // resume copying at SIGNUP

  app.get('/signup', function(req, res) {
    res.render('signup', { message: req.flash('signupMessage')});
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile',
    failureRedirect : '/signup',
    failureFlash  : true
  }));

  // Profile section
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile', {
      user  : req.user
    });
  });

  // Logout
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};

function isLoggedIn(req, res, next) {

  if(req.isAuthenticated()) return next;

  res.redirect('/');
}
