var express = require('express');
var router = express.Router();
const user = require("../controller/users");


router.get('/user', user.userTest);

router.get('/user/bus/:selDiv/:terCod',user.busTest);

module.exports = router;
