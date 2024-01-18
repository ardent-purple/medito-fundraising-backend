import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import fs from 'fs'
import path from 'path'
import https from 'https'
import { bootstrapControllers } from 'amala'
import { resolve } from 'path'
import env from '@/helpers/env'

const HTTPS_CONFIG = {
  key: fs
    .readFileSync(path.resolve(process.cwd(), 'certs/privkey.pem'), 'utf8')
    .toString(),

  cert: fs
    .readFileSync(path.resolve(process.cwd(), 'certs/fullchain.pem'), 'utf8')
    .toString(),
}

const app = new Koa()

export default async function () {
  const router = new Router()
  await bootstrapControllers({
    app,
    basePath: '/',
    controllers: [resolve(__dirname, '../controllers/*')],
    disableVersioning: true,
    router,
  })
  app.use(cors({ origin: '*' }))
  app.use(bodyParser())
  app.use(router.routes())
  app.use(router.allowedMethods())

  const cb = app.callback()
  const server = https.createServer(HTTPS_CONFIG, cb)
  server.listen(env.PORT, function () {
    console.log(`HTTPS server listening on ${env.PORT}`)
  })
}
