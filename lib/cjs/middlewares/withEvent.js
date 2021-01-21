"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withEvent = void 0;
/**
 * Inject AWS
 */
exports.withEvent = () => async (ctx, next) => {
    ctx.event = ctx.req && (ctx.req).event;
    await next();
};
//# sourceMappingURL=withEvent.js.map