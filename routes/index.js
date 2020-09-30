const router = require('express').Router();

// Visualize and manage the DB data
router.get("/", function (req, res) {
    res.render('index');
});

module.exports = router;