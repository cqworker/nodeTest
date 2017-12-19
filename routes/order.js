var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {

    req.getConnection(function (err, conn) {
        if (err) {
            return next(err);
        } else {
            conn.query('select * from user', [], function (err, result) {
                if (err) {
                    return next(err);
                } else {
                    var str = JSON.stringify(result);
                    console.log(str);
                    var jso = JSON.parse(str);
                    res.render('order', jso[0]);
                    //res.render('order', {name: result[0].name});
                }
            });
        }
    });

});
module.exports = router;