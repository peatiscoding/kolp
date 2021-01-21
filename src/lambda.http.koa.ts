// Entry point pattern using Koa
import type { KolpServiceState, KolpServiceContext } from './context'
import Koa from 'koa'
import Router from '@koa/router'
import serverless, { Handler } from 'serverless-http'

/**
 * Make serverless http handler using Koa.
 *
 * @param creator 
 * @param {ServerlessHttp.Options | any} options - see https://github.com/dougmoscrop/serverless-http/blob/HEAD/docs/ADVANCED.md
 */
export function makeServer(creator: (a: Koa<KolpServiceState, KolpServiceContext>) => void, options?: any): Handler {
  const app = new Koa<KolpServiceState, KolpServiceContext>()
  creator(app)
  return serverless(app, options)
}

/**
 * Make a serverless http handler using Koa's router.
 * @param creator
 * @param {ServerlessHttp.Options | any} options - see https://github.com/dougmoscrop/serverless-http/blob/HEAD/docs/ADVANCED.md
 */
export const makeServerWithRouter = (creator: (a: Router<KolpServiceState, KolpServiceContext>) => void, options?: any): Handler => {
  return makeServer((koa) => {
    const router = new Router<KolpServiceState, KolpServiceContext>()
    creator(router)
    koa.use(router.routes())
      .use(router.allowedMethods())
  }, {
    // Expose underlying event into original node req by default.
    request: (req, event, context) => {
      req.event = event
    },
    ...options
  })
}