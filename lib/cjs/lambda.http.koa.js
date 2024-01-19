"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeServerWithRouter = exports.makeServer = void 0;
const koa_1 = __importDefault(require("koa"));
const router_1 = __importDefault(require("@koa/router"));
const serverless_http_1 = __importDefault(require("serverless-http"));
/**
 * Make serverless http handler using Koa.
 *
 * @param creator
 * @param {ServerlessHttp.Options | any} options - see https://github.com/dougmoscrop/serverless-http/blob/HEAD/docs/ADVANCED.md
 */
function makeServer(creator, options) {
    const app = new koa_1.default();
    creator(app);
    return (0, serverless_http_1.default)(app, options);
}
exports.makeServer = makeServer;
/**
 * Make a serverless http handler using Koa's router.
 * @param creator
 * @param {ServerlessHttp.Options | any} options - see https://github.com/dougmoscrop/serverless-http/blob/HEAD/docs/ADVANCED.md
 */
const makeServerWithRouter = (creator, options) => {
    return makeServer((koa) => {
        const router = new router_1.default();
        creator(router);
        koa.use(router.routes())
            .use(router.allowedMethods());
    }, Object.assign({ 
        // Expose underlying event into original node req by default.
        request: (req, event, context) => {
            req.event = event;
        } }, options));
};
exports.makeServerWithRouter = makeServerWithRouter;
//# sourceMappingURL=lambda.http.koa.js.map