/// <reference types="koa-bodyparser" />
import type { KolpServiceState, KolpServiceContext } from './context';
import Koa from 'koa';
import Router from '@koa/router';
import { Handler } from 'serverless-http';
/**
 * Make serverless http handler using Koa.
 *
 * @param creator
 * @param {ServerlessHttp.Options | any} options - see https://github.com/dougmoscrop/serverless-http/blob/HEAD/docs/ADVANCED.md
 */
export declare function makeServer(creator: (a: Koa<KolpServiceState, KolpServiceContext>) => void, options?: any): Handler;
/**
 * Make a serverless http handler using Koa's router.
 * @param creator
 * @param {ServerlessHttp.Options | any} options - see https://github.com/dougmoscrop/serverless-http/blob/HEAD/docs/ADVANCED.md
 */
export declare const makeServerWithRouter: (creator: (a: Router<KolpServiceState, KolpServiceContext>) => void, options?: any) => Handler;
