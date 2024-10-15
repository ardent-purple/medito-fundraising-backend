import env from '@/helpers/env'
import cors from '@koa/cors'
import { bootstrapControllers } from 'amala'
import { Server } from 'http'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import { resolve } from 'path'

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

  return new Promise<Server>((resolve, reject) => {
    const connection = app
      .listen(env.PORT)
      .on('listening', () => {
        console.log(`HTTP is listening on ${env.PORT}`)
        resolve(connection)
      })
      .on('error', reject)
  })
}
