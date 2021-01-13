"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withStageVariables = void 0;
/**
 * This will augment `stageVariables` into Koa's context.
 * @param logger
 */
exports.withStageVariables = (logger) => async (ctx, next) => {
    var _a;
    const stageVariables = ctx.req && ((_a = (ctx.req).event) === null || _a === void 0 ? void 0 : _a.stageVariables);
    logger && logger.log(`[STG V] ${JSON.stringify(stageVariables)}`);
    ctx.stageVariables = stageVariables;
    await next();
};
//# sourceMappingURL=withStageVariables.js.map