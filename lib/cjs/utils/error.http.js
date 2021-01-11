"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KolpError = void 0;
class KolpError extends Error {
    constructor(statusCode, message, data) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
    }
    /**
     * Error due to Client side input
     *
     * @param code
     * @param message
     * @param data
     */
    static fromUserInput(code, message, data) {
        return new KolpError(code, message, data);
    }
    /**
     * Error due to Service side logic
     *
     * @param code
     * @param message
     * @param data
     */
    static fromServer(code, message, data) {
        return new KolpError(code, message, data);
    }
}
exports.KolpError = KolpError;
//# sourceMappingURL=error.http.js.map