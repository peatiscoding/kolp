import type { Logger } from './utils/logger'
import type {APIGatewayProxyEvent, APIGatewayProxyEventV2} from 'aws-lambda'
import { Context, Middleware as KoaMiddleware } from 'koa'

export interface KolpServiceContext extends Context {
  logger?: Logger
  event?: APIGatewayProxyEvent | APIGatewayProxyEventV2
}

export interface KolpServiceState {
}

export type Middleware = KoaMiddleware<KolpServiceState, KolpServiceContext>