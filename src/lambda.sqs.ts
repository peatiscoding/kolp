import type { SQSHandler, SQSRecord } from 'aws-lambda'
import SQS from 'aws-sdk/clients/sqs'
import { Logger } from './utils/logger'

interface MessageHandlerObject<M> {
  parseMessage?(body: any, sqsRecord: SQSRecord): M
  handleMessage(message: M, sqsRecord: SQSRecord): Promise<void>
}

interface MessageHandlerFunction<M> {
  (message: M, sqsRecord: SQSRecord): Promise<void>
}

export type MessageHandler<M> = MessageHandlerObject<M> | MessageHandlerFunction<M>


export type MessageHook = (o: SQSRecord) => void | Promise<void>

export interface MessageHandlerOption {
  bodyType: 'json' | 'string'
  parallelism: 'no' | 'full' | 'useMessageGroupId'
  /**
   * Delete Message Policy - how should lambda handle each SQSRecord?
   * 
   * - 'always-delete-on-success' - always explicitly delete success message.
   * - 'auto' - delete only success message when there is an error.
   * - 'never' - always let lambda delete all the message on its own.
   */
  deleteMessagePolicy: 'always-delete-on-success' | 'auto' | 'never',
  beforeEachMessage: MessageHook[]
  sqsConfig?: SQS.Types.ClientConfiguration
  logger?: Logger
}

interface SQSHandleResult {
  record: SQSRecord
  error?: Error
}

function getQueueUrl(sqs: SQS, eventSourceARN: string) {
  const [, , , , accountId, queueName] = eventSourceARN.split(':')
  return `${sqs.endpoint.href}${accountId}/${queueName}`
}

export const makeSQSHandler = <M>(messageHandler: MessageHandler<M>, opts: Partial<MessageHandlerOption>): SQSHandler => async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  const option: MessageHandlerOption = {
    bodyType: 'json',
    parallelism: 'full',
    beforeEachMessage: [],
    deleteMessagePolicy: 'never',
    ...opts,
  }

  const perMessageHandler: MessageHandlerObject<M> = (typeof messageHandler === 'function')
    ? ({
      parseMessage: (o) => o,
      handleMessage: messageHandler,
    })
    : messageHandler

  const bodyParser: (o: any) => any = option.bodyType === 'json' ? JSON.parse : (o) => `${o}`
  const handleOneMessage = async (rec: SQSRecord): Promise<SQSHandleResult> => {
    try {
      if (opts.logger) {
        opts.logger.log('Received message body=', JSON.stringify(rec.body))
        opts.logger.log('Received message attributes=', JSON.stringify(rec.attributes))
        opts.logger.log('Received message messageAttributes=', JSON.stringify(rec.messageAttributes))
      }
      // Lifecycle hooks
      if (option.beforeEachMessage && option.beforeEachMessage.length > 0) {
        for(const hook of option.beforeEachMessage) {
          await hook(rec)
        }
      }
      // Parse body
      const body = bodyParser(rec.body)
      // Parse message into contracted type.
      const message: M = perMessageHandler.parseMessage(body, rec)
      // Handle the message
      await perMessageHandler.handleMessage(message, rec)

      // Successfully processed the message.
      return { record: rec }
    } catch (error) {
      opts.logger?.error(`Handle message messageId: "${rec.messageId}". Failed`, error)
      return { record: rec, error }
    }
  }
  
  let result: SQSHandleResult[] = []
  if (option.parallelism === 'full') {
    result = await Promise.all((event.Records.map(handleOneMessage)))
  } else if (option.parallelism === 'no') {
    for(const rec of event.Records) {
      result.push(await handleOneMessage(rec))
    }
  } else if (option.parallelism === 'useMessageGroupId') {
    const group: { [key: string]: SQSRecord[] } = {}
    for (const rec of event.Records) {
      const messageGroupId = rec.attributes.MessageGroupId ?? '(no-group-id)'
      group[messageGroupId] = group[messageGroupId] || []
      group[messageGroupId].push(rec)
    }
    const keys = Object.keys(group)
    await Promise.all(keys.map((o) => async (): Promise<void> => {
      for (const rec of group[o]) {
        result.push(await handleOneMessage(rec))
      }
    }))
  }

  // Post processing
  if (opts.deleteMessagePolicy === 'never') {
    return null
  }
  const successResults: SQSHandleResult[] = result.filter((o) => !o.error)
  const errorRecords: SQSRecord[] = result.filter((o) => o.error).map((o) => o.record)

  if (opts.deleteMessagePolicy === 'always-delete-on-success' || (opts.deleteMessagePolicy === 'auto' && errorRecords.length > 0)) {
    const sqs = new SQS(option.sqsConfig)
    // Eventually we will delete all the success message and throw error if ncessary.
    for (const res of successResults) {
      const rec = res.record
      try {
        await sqs.deleteMessage({
          QueueUrl: getQueueUrl(sqs, rec.eventSourceARN),
          ReceiptHandle: rec.receiptHandle
        }).promise()
      } catch (error) {
        opts.logger?.error('Failed to delete processed messages.')
      }
    }
    // Throw error to release error records back to queue population.
    const recordIdentities = errorRecords.map((o) => ({ messageId: o.messageId, messageGroupId: o.attributes.MessageGroupId, body: o.body }))
    throw new Error(`Failed to completely process all SQS events. These ${recordIdentities.length} Error records are: ${JSON.stringify(recordIdentities)}`)
  }

  // Everything has been successfully processed. Let lambda handle deletion.
  return null
}
