import type { SQSHandler, SQSRecord } from 'aws-lambda';
import SQS from 'aws-sdk/clients/sqs';
import { Logger } from './utils/logger';
interface MessageHandlerObject<M> {
    parseMessage?(body: any, sqsRecord: SQSRecord): M;
    handleMessage(message: M, sqsRecord: SQSRecord): Promise<void>;
}
interface MessageHandlerFunction<M> {
    (message: M, sqsRecord: SQSRecord): Promise<void>;
}
export declare type MessageHandler<M> = MessageHandlerObject<M> | MessageHandlerFunction<M>;
export declare type MessageHook = (o: SQSRecord) => void | Promise<void>;
export interface MessageHandlerOption {
    bodyType: 'json' | 'string';
    parallelism: 'no' | 'full' | 'useMessageGroupId';
    /**
     * Delete Message Policy - how should lambda handle each SQSRecord?
     *
     * - 'always-delete-on-success' - always explicitly delete success message.
     * - 'auto' - delete only success message when there is an error.
     * - 'never' - always let lambda delete all the message on its own.
     */
    deleteMessagePolicy: 'always-delete-on-success' | 'auto' | 'never';
    beforeEachMessage: MessageHook[];
    sqsConfig?: SQS.Types.ClientConfiguration;
    logger?: Logger;
}
export declare const makeSQSHandler: <M>(messageHandler: MessageHandler<M>, opts: Partial<MessageHandlerOption>) => SQSHandler;
export {};
