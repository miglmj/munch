var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/cook', function(req, res, next) {
  res.render('cook');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', )

router.get('/about', function(req, res, next) {
  res.render('about');
});

module.exports = router;
