import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
export class BaseRoutedController {
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
        const router = new Router();
        router.use(bodyParser());
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
//# sourceMappingURL=_base.js.map