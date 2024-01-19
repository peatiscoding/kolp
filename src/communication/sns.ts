import { SNSClient as AwsSNSClient, MessageAttributeValue, PublishCommand, PublishInput, SNSClientConfig } from '@aws-sdk/client-sns'
import { Logger } from '../utils/logger'

// MessageAttributes --> Have to set UseRawMessage (true) on cloudformation template
// https://stackoverflow.com/questions/44238656/how-to-add-sqs-message-attributes-in-sns-subscription/49753291#49753291
export class SNSMessage<E> {

  constructor(
    public readonly Subject: string,
    public readonly Message: E,
    public readonly TopicArn: string,
    public readonly MessageAttributes?: {
      [key: string]: MessageAttributeValue;
    },
    public readonly MessageGroupId?: string
  ) {
  }

  public serialized(): PublishInput {
    return {
      Subject: this.Subject,
      Message: JSON.stringify(this.Message),
      TopicArn: this.TopicArn,
      MessageAttributes: this.MessageAttributes,
      MessageGroupId: this.MessageGroupId,
    }
  }
}

export interface SNSClientOption {
  logger?: Logger
}

export class SNSClient {

  private client: AwsSNSClient

  public constructor(configOrSNS: AwsSNSClient | SNSClientConfig, private readonly options?: Partial<SNSClientOption>) {
    if (configOrSNS instanceof AwsSNSClient) {
      this.client = configOrSNS
    } else {
      this.client = new AwsSNSClient(configOrSNS)
    }
  }

  /**
   * publish a message to specific queue
   *
   * @param message
   * @returns MessageId
   */
  public async publish<E>(message: SNSMessage<E>): Promise<string> {
    try {
      const publishCommand = new PublishCommand(message.serialized())
      const result = await this.client
        .send(publishCommand)
        

      if (!result.MessageId) {
        throw result
      }

      // Example output 
      // {
      //   ResponseMetadata: { RequestId: '2e7f9e9a-9e99-49f1-90b0-82d900996c9e' },
      //   MessageId: 'cf9c5d63-0f1d-40c3-9a31-9e42da95c371'
      // }
      this.options?.logger?.log(`Subject: ${message.Subject}; Message: ${result.MessageId} has been published.`)
      return result.MessageId
    } catch (e) {
      this.options?.logger?.error('Error from publishing message: ', e)
      throw (e)
    }
  }
}