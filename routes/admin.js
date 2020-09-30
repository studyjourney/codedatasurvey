const router = require('express').Router();

// Visualize and manage the DB data
router.get('/', function (req, res, next) {
    res.render('admin', {

    })
});

module.exports = router;