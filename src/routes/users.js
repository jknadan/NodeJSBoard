var express = require('express');
var router = express.Router();
const user = require("../controller/users");

router.get('/user', user.userTest);

router.get('/user/bus/:selDiv/:terCod',user.busTest);

router.get('/user/bus',user.getBusList);

router.get('/user/bus/:terNm',user.searchTerminal);

router.get('/bus/rest-area',user.getRestArea);



module.exports = router;
