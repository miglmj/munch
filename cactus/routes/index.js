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

  app.get('/cook', function(req, res) {
    var map;

    res.render('cook');


    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 30.438, lng: -84.28},
        zoom: 8
    });
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
