/**
 * This will augment `stageVariables` into Koa's context.
 * @param logger
 */
export const withStageVariables = (logger) => async (ctx, next) => {
    const stageVariables = ctx.req && (ctx.req).stageVariables;
    logger && logger.log(`[STG V] ${JSON.stringify(stageVariables)}`);
    ctx.stageVariables = stageVariables;
    await next();
};
//# sourceMappingURL=withStageVariables.js.map