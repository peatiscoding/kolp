"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route = void 0;
function Route(methodOrMeta = 'get', regExpToPath = '/', ...middlewares) {
    /**
     * @param {RouteMapController} target
     */
    return function (target, propertyKey, descriptor) {
        target.__drm = (target.__drm || {});
        target.__drm[propertyKey] = (typeof methodOrMeta === 'string' || methodOrMeta instanceof Array)
            ? {
                method: methodOrMeta,
                path: regExpToPath,
                middlewares: middlewares || [],
            }
            : methodOrMeta;
    };
}
exports.Route = Route;
//# sourceMappingURL=route.js.map