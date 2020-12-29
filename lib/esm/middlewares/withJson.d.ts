import { Middleware } from 'koa';
interface Logger {
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
}
export declare const withJson: (logger: Logger | undefined) => Middleware;
export {};
