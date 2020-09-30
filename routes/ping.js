const router = require('express').Router();

//To Provide Docker with a Heartbeat, we respond to ping
router.get('/', function (req, res) {
    res.status(200).send("pong");
});

module.exports = router;