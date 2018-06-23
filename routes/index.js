var express = require('express')
var router = express.Router()
let db = require('../model/db')

/* GET home page. */
router.get('/', function (req, res, next) {
  db.query('select * from love_card_user', [], function (result, fields) {
    res.json(result)
  })
})

module.exports = router
