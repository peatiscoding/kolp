import type { Logger } from './utils/logger';
import type { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from 'aws-lambda';
import { Context, Middleware as KoaMiddleware } from 'koa';
interface User {
    name: string;
    email: string;
    role: string;
}
export interface KolpServiceContext extends Context {
    event?: APIGatewayProxyEvent | APIGatewayProxyEventV2;
    logger?: Logger;
    auth: {
        user: User;
    };
}
export interface KolpServiceState {
}
export declare type Middleware = KoaMiddleware<KolpServiceState, KolpServiceContext>;
export {};
//# sourceMappingURL=context.d.ts.map