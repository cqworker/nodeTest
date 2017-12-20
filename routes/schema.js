var express = require('express');

var router = express.Router();


router.get('/edit/:name', function(req, res, next) {
  res.render('schema', { title: 'Express' });
});


router.get('/delete/:name', function(req, res, next) {
    res.render('schema', { title: 'Express' });
});

module.exports = router;
