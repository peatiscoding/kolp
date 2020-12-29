import { Middleware } from 'koa'

interface Logger {
  log: (...args: any[]) => void
  error: (...args: any[]) => void
}

export const withJson = (logger?: Logger): Middleware => async (ctx, next) => {
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
    logger?.error(`[<<] ${ctx.request.url} ${ctx.res.statusCode}`)
  }
}