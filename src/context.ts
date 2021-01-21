import type { Logger } from './utils/logger'
import type { APIGatewayProxyEvent } from 'aws-lambda'
import { Context, Middleware as KoaMiddleware } from 'koa'
interface User {
  name: string
  email: string
  role: string
}
export interface KolpServiceContext extends Context {
  logger?: Logger
  event?: APIGatewayProxyEvent
  discriminator: 'context'
  /**
   * Injected by custom authorizer lambda
   */
  auth: {
    user: User
  }
}

export interface KolpServiceState {}

export type Middleware = KoaMiddleware<KolpServiceState, KolpServiceContext>
