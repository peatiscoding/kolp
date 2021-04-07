import type { Middleware } from '../context'
import { Logger } from '../utils/logger'

export const withJson = (logger?: Logger): Middleware => async (ctx, next) => {
  // Assign logger if needed.
  ctx.logger = logger
  try {
    logger?.log(`[>>] ${ctx.request.url}`)
    await next()
    logger?.log(`[<<] ${ctx.request.url} ${ctx.res.statusCode}`)
  } catch (err) {
    // will only respond with JSON
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      success: false,
      code: err.code && err.code,
      error: err.message,
      data: err.data,
    };
    logger?.error(`[<<] .. [E ${err.code && err.code}] ${err.message} ${err.data && JSON.stringify(err.data)}`)
    logger?.error(`[<<] ${ctx.request.url} ${ctx.res.statusCode}`)
  }
}