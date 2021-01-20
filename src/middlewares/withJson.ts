import { Middleware } from 'koa'
import { CLogger } from '../utils/logger'

export const withJson = (project:string, isDevelopment:boolean): Middleware => async (ctx, next) => {
  const logger = new CLogger(ctx.request, project, isDevelopment)
  try {
    // logger?.log(`[>>] ${ctx.request.url}`)
    await next()
    // Response egress
    logger.info({
      errorMessage: '-',
      rawMessage: JSON.stringify(ctx.response.body),
      stackTrace: '-'
    })
    // logger?.log(`[<<] ${ctx.request.url} ${ctx.res.statusCode}`)
  } catch (err) {
    // will only respond with JSON
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      success: false,
      code: err.code && err.code,
      error: err.message,
      data: err.data,
    };
    logger.error({
      errorMessage: err,
      rawMessage: JSON.stringify(ctx.response.body),
      stackTrace: err.stack
    })
    // logger?.error(`[<<] ${ctx.request.url} ${ctx.res.statusCode}`)
  }
}