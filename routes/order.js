var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

    req.getConnection(function(err, conn) {
        if (err) {
            console.log("error");
            return next(err);
        } else {
            conn.query('select * from user', [], function(err,result) {
                if (err) {
                    console.log("error");
                    return next(err);
                } else {
                    console.log(result);
                    res.render('order', { name: "mysql" });
                }
            });
        }
    });

});
module.exports = router;