"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeServerWithRouter = exports.makeServer = void 0;
// Entry point pattern using Koa
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
    return serverless_http_1.default(app, options);
}
exports.makeServer = makeServer;
/**
 * Make a serverless http handler using Koa's router.
 * @param creator
 * @param {ServerlessHttp.Options | any} options - see https://github.com/dougmoscrop/serverless-http/blob/HEAD/docs/ADVANCED.md
 */
exports.makeServerWithRouter = (creator, options) => {
    return makeServer((koa) => {
        const router = new router_1.default();
        creator(router);
        koa.use(router.routes())
            .use(router.allowedMethods());
    }, options);
};
//# sourceMappingURL=lambda.http.koa.js.map