"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withEvent = void 0;
/**
 * Inject AWS
 */
const withEvent = () => async (ctx, next) => {
    ctx.event = ctx.req && (ctx.req).event;
    await next();
};
exports.withEvent = withEvent;
//# sourceMappingURL=withEvent.js.map