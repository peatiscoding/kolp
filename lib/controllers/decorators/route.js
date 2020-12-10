export function Route(methodOrMeta = 'get', regExpToPath = '/', ...middlewares) {
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
//# sourceMappingURL=route.js.map