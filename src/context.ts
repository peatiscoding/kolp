import type { Logger } from './utils/logger'
import { Context, Middleware as KoaMiddleware } from 'koa'

export interface KolpServiceContext extends Context {
  logger?: Logger
}

export interface KolpServiceState {
}

export type Middleware = KoaMiddleware<KolpServiceState, KolpServiceContext>