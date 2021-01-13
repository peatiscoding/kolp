import { Middleware } from 'koa'
import { Logger } from '../utils/logger'

/**
 * This will augment `stageVariables` into Koa's context.
 * @param logger 
 */
export const withStageVariables = (logger?: Logger): Middleware => async (ctx, next) => {
  const stageVariables = ctx.req && ((ctx.req) as any).event?.stageVariables
  logger && logger.log(`[STG V] ${JSON.stringify(stageVariables)}`)
  ctx.stageVariables = stageVariables
  await next()
}