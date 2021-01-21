import type { Middleware } from '../context'

/**
 * Inject AWS
 */
export const withEvent = (): Middleware => async (ctx, next) => {
  ctx.event = ctx.req && ((ctx.req) as any).event
  await next()
}