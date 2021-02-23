import { Middleware } from 'koa'
import type { KolpServiceContext, KolpServiceState } from '../context'
import Router from '@koa/router'
import bodyParser from 'koa-bodyparser'

export type HttpMethod = 'post'|'get'|'delete'|'put'|'patch'

export interface RouteMapMeta {
  method: HttpMethod | HttpMethod[]
  path?: string
  middlewares?: Middleware[]
}

export interface RouteMap {
  [key: string]: RouteMapMeta
}

export type KolpRouter = Router<KolpServiceState, KolpServiceContext>

export class BaseRoutedController {

  getRouteMaps(): RouteMap {
    return {
      ...((<any>this).__drm || {}), /* will be injected from decorators package */
    }
  }

  async handleSuccess(context: KolpServiceContext, data: any): Promise<void> {
    context.response.status = 200
    context.response.body = {
      success: true,
      data
    }
  }

  /**
   * Counter path of getRouter(). Use this method to register the controller to given router.
   * 
   * @param path 
   * @param koaRouter 
   */
  public register(path: string, koaRouter: KolpRouter, ...middlewares: Middleware<KolpServiceState, KolpServiceContext>[]) {
    const r = this.getRouter()
    koaRouter.use(path, ...middlewares, r.routes(), r.allowedMethods())
  }

  public getRouter(): KolpRouter {
    const router = new Router<KolpServiceState, KolpServiceContext>()
    router.use(bodyParser())
    const map = this.getRouteMaps()
    for(const fname in map) {
      let { method, path } = map[fname]
      const { middlewares } = map[fname]
      path = path || `/${fname}`
      if (typeof method === 'string') {
        method = [method]
      }
      for(const _m of method) {
        for(let i = 0; i < (middlewares || []).length; i += 1) {
          router[_m](path, middlewares[i])
        }
        router[_m](path, async (ctx, next): Promise<void> => {
          try {
            const out = await this[fname || 'index'](ctx)
            const res = ctx.response
            if (!(res as any).doNotHandleSuccess) {
              await this.handleSuccess(ctx, out)
            }
          } catch(error) {
            ctx.throw(error)
          }
        })
      }
    }
    return router
  }
}
