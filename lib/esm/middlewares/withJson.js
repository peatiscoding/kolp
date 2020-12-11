export const withJson = () => async (ctx, next) => {
    try {
        await next();
    }
    catch (err) {
        // will only respond with JSON
        ctx.status = err.statusCode || err.status || 500;
        ctx.body = {
            success: false,
            error: err.message
        };
    }
};
//# sourceMappingURL=withJson.js.map