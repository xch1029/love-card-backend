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
  const {email, password, gender} = req.body
  const passwordMd5 = utils.cryptoString(password)
  db.query(
    `INSERT INTO love_card_user (userName, email, password, gender) VALUES ('${email}', '${email}', '${passwordMd5}', '${gender}')`,
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
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        // exp: Math.floor(Date.now() / 1000) + (60 * 1),
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
// 根据token获取用户信息
router.get('/getUserInfo', function (req, res, next) {
  db.query(`SELECT * FROM love_card_user WHERE id='${req.userId}'`, [], function (result, fields) {
    res.json({
      code: 0,
      msg: '获取用户信息成功',
      data: result
    })
  })
})
// 修改用户信息
router.post('/updateUser', function (req, res, next) {
  let keys = Object.keys(req.body)
  let actions = keys.map(key => `${key}='${req.body[key]}'`).join(',')
  db.query(`UPDATE love_card_user SET ${actions} WHERE id=${req.userId}`, [], function (result, fields) {
    res.json({
      code: 0,
      msg: '修改成功'
    })
  })
})
// 添加卡片模型
router.post('/addCardModel', function (req, res, next) {
  const {name, msg} = req.body
  const time = (new Date()).toString()
  console.log(time)
  db.query(`INSERT INTO card_model (name, createUserId, msg, createTime) VALUES ('${name}', ${req.userId}, '${msg}', '${time}')`, [], function (result, fields) {
    res.json({
      code: 0,
      msg: '添加成功'
    })
  })
})
// 获取卡片模型列表
router.get('/cardModelList', function (req, res, next) {
  db.query(`SELECT * FROM card_model WHERE createUserId=${req.userId} AND 'drop'=0`, [], function (result, fields) {
    res.json({
      code: 0,
      msg: '获取成功',
      data: result
    })
  })
})
// 修改卡片模型信息
router.post('/updateCardModel', function (req, res, next) {
  let keys = Object.keys(req.body.data)
  let actions = keys.map(key => `${key}='${req.body.data[key]}'`).join(',')
  db.query(
    `UPDATE card_model SET ${actions} WHERE id=${req.body.id} AND createUserId=${req.userId}`,
    [],
    function (reaults, fields) {
      res.json({
        code: 0,
        msg: '修改成功'
      })
    }
  )
})
// 删除卡片模型
router.post('/delCardModel', function (req, res, next) {
  const cardId = req.body.id
  db.query(
    `UPDATE card_model SET \`drop\`=1 WHERE id=${cardId} AND createUserId=${req.userId}`,
    [],
    function (reaults, fields) {
      res.json({
        code: 0,
        msg: '删除成功'
      })
    }
  )
})
// 获取拥有的卡片
router.get('/cardList', function (req, res, next) {
  db.query(
    `SELECT * FROM cards WHERE cards.to = ${req.userId}`,
    [],
    function (result1, fields) {
      const cardIdList = result1.map(i => i.cardId)
      console.log(cardIdList)
      db.query(`SELECT * FROM card_model WHERE id in (${cardIdList.join(',')})`, [], function (result2, fields) {
        const data = result2.map(i => {
          i.count = cardIdList.filter(j => j === i.id).length
          return i
        })
        res.json({
          code: 0,
          data
        })
      })
    }
  )
})
module.exports = router
