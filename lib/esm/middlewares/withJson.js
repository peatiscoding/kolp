export const withJson = (logger) => async (ctx, next) => {
    try {
        logger === null || logger === void 0 ? void 0 : logger.log(`[>>] ${ctx.request.url}`);
        await next();
        logger === null || logger === void 0 ? void 0 : logger.log(`[<<] ${ctx.request.url} ${ctx.res.statusCode}`);
    }
    catch (err) {
        // will only respond with JSON
        ctx.status = err.statusCode || err.status || 500;
        ctx.body = {
            success: false,
            code: err.code && err.code,
            error: err.message,
            data: err.data,
        };
        logger === null || logger === void 0 ? void 0 : logger.error(`[<<] ${ctx.request.url} ${ctx.res.statusCode}`);
    }
};
//# sourceMappingURL=withJson.js.map