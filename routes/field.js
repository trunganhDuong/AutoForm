var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');
var Field=require('../models/field.model')

/* GET field management  page. */
router.get('/', function(req, res, next) {
  res.render('field')
});

module.exports = router;
