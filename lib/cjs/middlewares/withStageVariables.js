"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withStageVariables = void 0;
/**
 * This will augment `stageVariables` into Koa's context.
 * @param logger
 */
exports.withStageVariables = (logger) => async (ctx, next) => {
    const stageVariables = ctx.req && (ctx.req).stageVariables;
    logger && logger.log(`[STG V] ${JSON.stringify(stageVariables)}`);
    ctx.stageVariables = stageVariables;
    await next();
};
//# sourceMappingURL=withStageVariables.js.map