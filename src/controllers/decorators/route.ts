import { Middleware } from 'koa'
import { HttpMethod, RouteMapMeta } from '../_base'

export function Route(): MethodDecorator
export function Route(meta: RouteMapMeta): MethodDecorator
export function Route(method: HttpMethod | HttpMethod[], regExpToPath?: string, ...middlewares: Middleware[]): MethodDecorator
export function Route(methodOrMeta: RouteMapMeta | HttpMethod | HttpMethod[] = 'get', regExpToPath: string = '/', ...middlewares: Middleware[]): MethodDecorator {
  /**
   * @param {RouteMapController} target
   */
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    target.__drm = (target.__drm || {})
    target.__drm[propertyKey] = (typeof methodOrMeta === 'string' || methodOrMeta instanceof Array)
      ? {
        method: methodOrMeta,
        path: regExpToPath,
        middlewares: middlewares || [],
      }
      : methodOrMeta
  }
}