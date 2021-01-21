import type { Middleware } from '../context'
import { Logger } from '../utils/logger'

export const withJson = (logger?: Logger): Middleware => async (ctx, next) => {
  // Assign logger if needed.
  ctx.logger = logger
  try {
    await next() 
    ctx.logger.info({
      statusCode: ctx.response.status,
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
    ctx.logger.error({
      statusCode: ctx.response.status,
      errorMessage: err,
      rawMessage: JSON.stringify(ctx.response.body),
      stackTrace: err.stack
    })
    // logger?.error(`[<<] ${ctx.request.url} ${ctx.res.statusCode}`)
  }
}