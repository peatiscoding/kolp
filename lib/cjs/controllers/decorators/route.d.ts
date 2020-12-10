import { Middleware } from 'koa';
import { HttpMethod, RouteMapMeta } from '../_base';
export declare function Route(): MethodDecorator;
export declare function Route(meta: RouteMapMeta): MethodDecorator;
export declare function Route(method: HttpMethod | HttpMethod[], regExpToPath?: string, ...middlewares: Middleware[]): MethodDecorator;
