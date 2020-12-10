import { Middleware } from 'koa'
import { BaseRoutedController, HttpMethod, RouteMapMeta } from '../_base'

export function Route(): MethodDecorator
export function Route(meta: RouteMapMeta): MethodDecorator
export function Route(method: HttpMethod | HttpMethod[], regExpToPath: string, ...middlewares: Middleware[]): MethodDecorator
export function Route(methodOrMeta: RouteMapMeta | HttpMethod | HttpMethod[] = 'get', regExpToPath: string = '/', ...middlewares: Middleware[]): MethodDecorator {
  return function (target: BaseRoutedController, propertyKey: string, descriptor: PropertyDescriptor) {
    const anyTarget: any = target
    anyTarget.deocratedRouteMap = (anyTarget.deocratedRouteMap || {})
    let meta: RouteMapMeta = undefined
    if (typeof methodOrMeta === 'object' && !(methodOrMeta instanceof Array)) {
      meta = methodOrMeta
    } else {
      meta = {
        method: methodOrMeta,
        path: regExpToPath,
        middlewares: middlewares || [],
      }
    }
    anyTarget.deocratedRouteMap[propertyKey] = meta
  }
}