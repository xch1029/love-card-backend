var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var jwt = require('jsonwebtoken')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// 跨域
var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.header('Access-Control-Allow-Headers', 'token, Content-Type')
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
}
// TODO: 先注释掉，让小倩知道会跨域
app.use(allowCrossDomain)

// 验证token
var tokenValidation = function (req, res, next) {
  const unlessPath = ['/api/love/login', '/api/love/registry']
  if (unlessPath.includes(req.path)) return next()
  const {token} = req.headers
  jwt.verify(token, 'secret', function (err, decoded) {
    if (err) {
      res.json({
        code: 1,
        msg: 'token异常'
      })
    } else {
      req.userId  = decoded.data.userId
      next()
    }
  })
}
app.use(tokenValidation)

app.use('/api/love/', indexRouter)
app.use('/api/love/users', usersRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
