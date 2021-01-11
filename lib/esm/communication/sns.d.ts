import { SNS } from 'aws-sdk';
import { Logger } from '../utils/logger';
export declare class SNSMessage<E> {
    readonly Subject: string;
    readonly Message: E;
    readonly TopicArn: string;
    readonly MessageAttributes?: SNS.MessageAttributeMap;
    readonly MessageGroupId?: string;
    constructor(Subject: string, Message: E, TopicArn: string, MessageAttributes?: SNS.MessageAttributeMap, MessageGroupId?: string);
    serialized(): SNS.Types.PublishInput;
}
export interface SNSClientOption {
    logger: Logger;
}
export declare class SNSClient {
    private readonly options;
    private client;
    constructor(configOrSNS: SNS | SNS.Types.ClientConfiguration, options: SNSClientOption);
    /**
     * publish a message to specific queue
     *
     * @param message
     * @returns MessageId
     */
    publish<E>(message: SNSMessage<E>): Promise<string>;
}
