// Informational responses (100–199)
// Successful responses (200–299)
// Redirects (300–399)
// Client errors (400–499)
// Server errors (500–599)
// SEE https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
export var SuccessCode;
(function (SuccessCode) {
    /**
     * Success!
     */
    SuccessCode[SuccessCode["ok"] = 200] = "ok";
    /**
     * Resource has been created, usually reply upon creation/update
     */
    SuccessCode[SuccessCode["created"] = 201] = "created";
    /**
     * Request has been accepted to process, put on the queue, and still waiting for response.
     */
    SuccessCode[SuccessCode["accepted"] = 202] = "accepted";
    /**
     * Grabbing the resource that has no content. But header might be useful.
     */
    SuccessCode[SuccessCode["noContent"] = 204] = "noContent";
    /**
     * Content of this request has been reset.
     */
    SuccessCode[SuccessCode["reset"] = 205] = "reset";
    /**
     * Use this when there is a range of content to be sent over. Example (Audio/Video streams).
     */
    SuccessCode[SuccessCode["partial"] = 206] = "partial";
})(SuccessCode || (SuccessCode = {}));
export var RedirectonCode;
(function (RedirectonCode) {
    /**
     *
     */
    RedirectonCode[RedirectonCode["permanent"] = 301] = "permanent";
    /**
     *
     */
    RedirectonCode[RedirectonCode["temporarily"] = 302] = "temporarily";
})(RedirectonCode || (RedirectonCode = {}));
export var ClientErrorCode;
(function (ClientErrorCode) {
    /**
     * Incoming input doesn't make sense, invalid syntax, invalid format.
     */
    ClientErrorCode[ClientErrorCode["badRequest"] = 400] = "badRequest";
    /**
     * The request is not authorized.
     */
    ClientErrorCode[ClientErrorCode["unauthorized"] = 401] = "unauthorized";
    /**
     * Payment is required.
     */
    ClientErrorCode[ClientErrorCode["paymentRequired"] = 402] = "paymentRequired";
    /**
     * User is already authenticated, but does not have sufficient permission to access the resource
     */
    ClientErrorCode[ClientErrorCode["forbidden"] = 403] = "forbidden";
    /**
     * The actual resource is not available on the server, This usually have to pass through 400 ~ 403 first
     * before emit this error code.
     */
    ClientErrorCode[ClientErrorCode["notFound"] = 404] = "notFound";
    /**
     * Method is not allowed, the HTTP verb is not supported at ths endpoint.
     */
    ClientErrorCode[ClientErrorCode["methodNotAllowed"] = 405] = "methodNotAllowed";
})(ClientErrorCode || (ClientErrorCode = {}));
export var ServerErrorCode;
(function (ServerErrorCode) {
    /**
     * Unhandled situation, use this when underlying error failed to produce an expected result.
     */
    ServerErrorCode[ServerErrorCode["internalServerError"] = 500] = "internalServerError";
    /**
     * The service or endpoint is not yet implemented.
     */
    ServerErrorCode[ServerErrorCode["notImplemented"] = 501] = "notImplemented";
    /**
     * The underlying service failed to deliver the expected response.
     */
    ServerErrorCode[ServerErrorCode["badGateway"] = 502] = "badGateway";
    /**
     * The service went down form maintenance,
     */
    ServerErrorCode[ServerErrorCode["unavailable"] = 503] = "unavailable";
    /**
     * The underlying service took too long to response.
     */
    ServerErrorCode[ServerErrorCode["gatewayTimeout"] = 504] = "gatewayTimeout";
})(ServerErrorCode || (ServerErrorCode = {}));
//# sourceMappingURL=response.js.map