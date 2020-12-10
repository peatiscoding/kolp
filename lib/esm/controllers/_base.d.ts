/// <reference types="koa__router" />
import { Middleware, Context } from 'koa';
import Router from '@koa/router';
export declare type HttpMethod = 'post' | 'get' | 'delete' | 'put' | 'patch';
export interface RouteMapMeta {
    method: HttpMethod | HttpMethod[];
    path?: string;
    middlewares?: Middleware[];
}
export interface RouteMap {
    [key: string]: RouteMapMeta;
}
export declare class BaseRoutedController {
    getRouteMaps(): RouteMap;
    handleSuccess(context: Context, data: any): Promise<void>;
    /**
     * Counter path of getRouter(). Use this method to register the controller to given router.
     *
     * @param path
     * @param koaRouter
     */
    register(path: string, koaRouter: Router): void;
    getRouter(): Router;
}
