import { SNSClient as AwsSNSClient, MessageAttributeValue, PublishInput, SNSClientConfig } from '@aws-sdk/client-sns';
import { Logger } from '../utils/logger';
export declare class SNSMessage<E> {
    readonly Subject: string;
    readonly Message: E;
    readonly TopicArn: string;
    readonly MessageAttributes?: {
        [key: string]: MessageAttributeValue;
    };
    readonly MessageGroupId?: string;
    constructor(Subject: string, Message: E, TopicArn: string, MessageAttributes?: {
        [key: string]: MessageAttributeValue;
    }, MessageGroupId?: string);
    serialized(): PublishInput;
}
export interface SNSClientOption {
    logger?: Logger;
}
export declare class SNSClient {
    private readonly options?;
    private client;
    constructor(configOrSNS: AwsSNSClient | SNSClientConfig, options?: Partial<SNSClientOption>);
    /**
     * publish a message to specific queue
     *
     * @param message
     * @returns MessageId
     */
    publish<E>(message: SNSMessage<E>): Promise<string>;
}
