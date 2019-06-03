/*
 * @Description:
 * @Author: xg-a06
 * @Date: 2019-06-03 12:34:55
 * @LastEditTime: 2019-06-03 13:14:11
 * @LastEditors: xg-a06
 */
const Koa = require('koa')
const cors = require('koa2-cors')
const bodyparser = require('./bodyParser')
const indexRoutes = require('./router')

const app = new Koa()

app.use(
  cors({
    origin: function(ctx) {
      return '*'
    },
    maxAge: 300,
    allowMethods: ['GET', 'POST']
  })
)

app.use(
  bodyparser({
    enableTypes: ['json', 'form-urlencoded', 'form-data']
  })
)

app.use(indexRoutes())

app.listen(8768, () => {
  console.log('upload demo server is running at 8768')
})
