"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRoutedController = void 0;
const router_1 = __importDefault(require("@koa/router"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
class BaseRoutedController {
    getRouteMaps() {
        return Object.assign({}, (this.deocratedRouteMap || {}));
    }
    async handleSuccess(context, data) {
        context.response.status = 200;
        context.response.body = {
            success: true,
            data
        };
    }
    /**
     * Counter path of getRouter(). Use this method to register the controller to given router.
     *
     * @param path
     * @param koaRouter
     */
    register(path, koaRouter) {
        const r = this.getRouter();
        koaRouter.use(path, r.routes(), r.allowedMethods());
    }
    getRouter() {
        const router = new router_1.default();
        router.use(koa_bodyparser_1.default());
        const map = this.getRouteMaps();
        for (const fname in map) {
            let { method, path } = map[fname];
            const { middlewares } = map[fname];
            path = path || `/${fname}`;
            if (typeof method === 'string') {
                method = [method];
            }
            for (const _m of method) {
                for (let i = 0; i < (middlewares || []).length; i += 1) {
                    router[_m](path, middlewares[i]);
                }
                router[_m](path, async (ctx, next) => {
                    try {
                        const out = await this[fname || 'index'](ctx);
                        const res = ctx.response;
                        if (!res.doNotHandleSuccess) {
                            await this.handleSuccess(ctx, out);
                        }
                    }
                    catch (error) {
                        ctx.throw(error);
                    }
                });
            }
        }
        return router;
    }
}
exports.BaseRoutedController = BaseRoutedController;
//# sourceMappingURL=_base.js.map