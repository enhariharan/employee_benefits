"use strict";

const express = require('express');
const router = express.Router();
const path = require('path');


/* GET home page. */
router.get('/', function(req, res, ignoreNext) {
  res.sendFile(path.join(__dirname+'/../views/', 'build', 'index.html'));
});

module.exports = router;
