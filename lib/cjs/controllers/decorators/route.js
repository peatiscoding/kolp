"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route = void 0;
function Route(methodOrMeta = 'get', regExpToPath = '/', ...middlewares) {
    return function (target, propertyKey, descriptor) {
        const anyTarget = target;
        anyTarget.deocratedRouteMap = (anyTarget.deocratedRouteMap || {});
        let meta = undefined;
        if (typeof methodOrMeta === 'object' && !(methodOrMeta instanceof Array)) {
            meta = methodOrMeta;
        }
        else {
            meta = {
                method: methodOrMeta,
                path: regExpToPath,
                middlewares: middlewares || [],
            };
        }
        anyTarget.deocratedRouteMap[propertyKey] = meta;
    };
}
exports.Route = Route;
//# sourceMappingURL=route.js.map