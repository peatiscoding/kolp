import { Middleware } from 'koa';
import { Logger } from '../utils/logger';
/**
 * This will augment `stageVariables` into Koa's context.
 * @param logger
 */
export declare const withStageVariables: (logger?: Logger) => Middleware;
