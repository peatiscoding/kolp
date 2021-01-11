import { ErrorCode, ClientErrorCode, ServerErrorCode } from './response';
export declare class KolpError extends Error {
    readonly statusCode: ErrorCode;
    readonly data?: any;
    constructor(statusCode: ErrorCode, message: string, data?: any);
    /**
     * Error due to Client side input
     *
     * @param code
     * @param message
     * @param data
     */
    static fromUserInput(code: ClientErrorCode, message: string, data?: any): KolpError;
    /**
     * Error due to Service side logic
     *
     * @param code
     * @param message
     * @param data
     */
    static fromServer(code: ServerErrorCode, message: string, data?: any): KolpError;
}
