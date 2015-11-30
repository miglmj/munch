module.exports = function(app, passport) {

  // Home Page
  app.get('/', function(req, res) {
    res.render('index');
  });

  // Initial login page
  app.get('/login', function(req, res) {
    //render the page and pass any existing flash data
    res.render('login', { message: req.flash('loginMessage')});
  });

  // process the login form
  // note app.post, not app.get
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile',
    failureRedirect : '/login',
    failureFlash    : true
  }),
      function(req, res) {
        console.log("wow we made it this far");

        if (req.body.remember) {
          req.session.cookie.maxAge = 1000 * 60 * 10;
        } else {
          req.session.cookie.expires = false;
        }
      res.redirect('/');
  });

  app.get('/signup', function(req, res) {
    res.render('signup', { message: req.flash('signupMessage') });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile', {
      username : req.user.username
    });
  });

  app.get('/cook', isLoggedIn, function(req, res) {
    res.render('cook');
  });

  app.post('/cook', isLoggedIn, function(req, res) {

    var title = req.body.title;
    var price = req.body.price;
    var address = req.body.address;
    var datetime = req.body.mealdate + " " + req.body.mealtime;
    var userid  = req.user.id;

    console.log(title);
    console.log(price);
    console.log(address);
    console.log(datetime);
    console.log(userid);





    if(title.length > 0 && title.length <= 30) {
      if(price > 0 && price < 1000) {
        if(address.length > 0 && address.length < 121) {

        }
      }
    }

  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};

function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
