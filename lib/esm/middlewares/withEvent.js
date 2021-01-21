/**
 * Inject AWS
 */
export const withEvent = () => async (ctx, next) => {
    ctx.event = ctx.req && (ctx.req).event;
    await next();
};
//# sourceMappingURL=withEvent.js.map