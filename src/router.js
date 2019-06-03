/*
 * @Description:
 * @Author: xg-a06
 * @Date: 2019-05-24 12:37:47
 * @LastEditTime: 2019-06-03 14:28:14
 * @LastEditors: xg-a06
 */
const KoaRouter = require('koa-router')
const koaCompose = require('koa-compose')
const upload = require('./controller')

const router = new KoaRouter()

router.get('/', async (ctx, next) => {
  ctx.body = 'upload demo server'
})

router.get('/upload/:hash', async (ctx, next) => {
  let hash = ctx.params.hash
  let ret = await upload.getIndexByHash(hash)
  ctx.body = ret
})
router.post('/upload', async (ctx, next) => {
  let ret = upload.upload(ctx.req.body)
  ctx.body = ret
})

router.post('/complete', async (ctx, next) => {
  let ret = await upload.complete(ctx.req.body)
  ctx.body = ret
})

module.exports = () => {
  return koaCompose([router.routes(), router.allowedMethods()])
}
