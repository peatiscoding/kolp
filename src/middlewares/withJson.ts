import type { Middleware } from '../context'
import { Logger } from '../utils/logger'

export const withJson = (logger?: Logger): Middleware => async (ctx, next) => {
  // Assign logger if needed.
  ctx.logger = logger
  // For loggingto be able to validate type
  ctx.discriminator = 'context'
  try {
    await next() 
    ctx.logger.info(ctx)
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
    ctx.logger.error(ctx, {
      errorMessage: err.message,
      stackTrace: err.stackTrace
    })
    // logger?.error(`[<<] ${ctx.request.url} ${ctx.res.statusCode}`)
  }
}