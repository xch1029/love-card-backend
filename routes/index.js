var express = require('express')
var router = express.Router()
var jwt = require('jsonwebtoken')
var utils = require('../utils/utils')
let db = require('../model/db')

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(req.userId)
  db.query('select * from love_card_user', [], function (result, fields) {
    res.json(result)
  })
})
// 注册
router.post('/registry', function(req, res, next) {
  const {email, password} = req.body
  const passwordMd5 = utils.cryptoString(password)
  db.query(
    `INSERT INTO love_card_user (userName, email, password) VALUES ('${email}', '${email}', '${passwordMd5}')`,
    [],
    function (result) {
      res.json({
        code: 0,
        msg: '注册成功'
      })
    }
  )
})
// 登录
router.post('/login', function (req, res, next) {
  const {email, password} = req.body
  db.query(`SELECT * FROM love_card_user WHERE email='${email}'`, [], function (result, fields) {
    if (result[0] && utils.cryptoString(password) === result[0].password) {
      const token = jwt.sign({
        // exp: Math.floor(Date.now() / 1000) + (60 * 60),
        exp: Math.floor(Date.now() / 1000) + (60 * 5),
        data: {userId: result[0].id}
      }, 'secret')
      res.json({
        code: 0,
        data: result[0],
        token
      })
    } else {
      res.json({
        code: 1,
        msg: '登录失败'
      })
    }
  })
})

module.exports = router
