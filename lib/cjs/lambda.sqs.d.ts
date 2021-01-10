import type { SQSHandler, SQSRecord } from 'aws-lambda';
import SQS from 'aws-sdk/clients/sqs';
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
    beforeEachMessage: MessageHook[];
    sqsConfig?: SQS.Types.ClientConfiguration;
}
export declare const makeSQSHandler: <M>(messageHandler: MessageHandler<M>, opts: Partial<MessageHandlerOption>) => SQSHandler;
export {};
