/// <reference types="koa__router" />
import { Middleware } from 'koa';
import type { KolpServiceContext, KolpServiceState } from '../context';
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
export declare type KolpRouter = Router<KolpServiceState, KolpServiceContext>;
export declare class BaseRoutedController {
    getRouteMaps(): RouteMap;
    handleSuccess(context: KolpServiceContext, data: any): Promise<void>;
    /**
     * Counter path of getRouter(). Use this method to register the controller to given router.
     *
     * @param path
     * @param koaRouter
     */
    register(path: string, koaRouter: KolpRouter): void;
    getRouter(): KolpRouter;
}
