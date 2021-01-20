import Koa from 'koa';
import Router from '@koa/router';
import serverless from 'serverless-http';
/**
 * Make serverless http handler using Koa.
 *
 * @param creator
 * @param {ServerlessHttp.Options | any} options - see https://github.com/dougmoscrop/serverless-http/blob/HEAD/docs/ADVANCED.md
 */
export function makeServer(creator, options) {
    const app = new Koa();
    creator(app);
    return serverless(app, options);
}
/**
 * Make a serverless http handler using Koa's router.
 * @param creator
 * @param {ServerlessHttp.Options | any} options - see https://github.com/dougmoscrop/serverless-http/blob/HEAD/docs/ADVANCED.md
 */
export const makeServerWithRouter = (creator, options) => {
    return makeServer((koa) => {
        const router = new Router();
        creator(router);
        koa.use(router.routes())
            .use(router.allowedMethods());
    }, Object.assign({ 
        // Expose underlying event into original node req by default.
        request: (req, event, context) => {
            req.event = event;
        } }, options));
};
//# sourceMappingURL=lambda.http.koa.js.map