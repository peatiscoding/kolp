"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSQSHandler = void 0;
const sqs_1 = __importDefault(require("aws-sdk/clients/sqs"));
function getQueueUrl(sqs, eventSourceARN) {
    const [, , , , accountId, queueName] = eventSourceARN.split(':');
    return `${sqs.endpoint.href}${accountId}/${queueName}`;
}
exports.makeSQSHandler = (messageHandler, opts) => async (event, context) => {
    var _a, _b;
    context.callbackWaitsForEmptyEventLoop = false;
    const option = Object.assign({ bodyType: 'json', parallelism: 'full', beforeEachMessage: [], deleteMessagePolicy: 'never' }, opts);
    const perMessageHandler = (typeof messageHandler === 'function')
        ? ({
            parseMessage: (o) => o,
            handleMessage: messageHandler,
        })
        : messageHandler;
    const bodyParser = option.bodyType === 'json' ? JSON.parse : (o) => `${o}`;
    const handleOneMessage = async (rec) => {
        var _a;
        try {
            if (opts.logger) {
                opts.logger.log('Received message body=', JSON.stringify(rec.body));
                opts.logger.log('Received message attributes=', JSON.stringify(rec.attributes));
                opts.logger.log('Received message messageAttributes=', JSON.stringify(rec.messageAttributes));
            }
            // Lifecycle hooks
            if (option.beforeEachMessage && option.beforeEachMessage.length > 0) {
                for (const hook of option.beforeEachMessage) {
                    await hook(rec);
                }
            }
            // Parse body
            const body = bodyParser(rec.body);
            // Parse message into contracted type.
            const message = perMessageHandler.parseMessage(body, rec);
            // Handle the message
            await perMessageHandler.handleMessage(message, rec);
            // Successfully processed the message.
            return { record: rec };
        }
        catch (error) {
            (_a = opts.logger) === null || _a === void 0 ? void 0 : _a.error(`Handle message messageId: "${rec.messageId}". Failed`, error);
            return { record: rec, error };
        }
    };
    let result = [];
    if (option.parallelism === 'full') {
        result = await Promise.all((event.Records.map(handleOneMessage)));
    }
    else if (option.parallelism === 'no') {
        for (const rec of event.Records) {
            result.push(await handleOneMessage(rec));
        }
    }
    else if (option.parallelism === 'useMessageGroupId') {
        const group = {};
        for (const rec of event.Records) {
            const messageGroupId = (_a = rec.attributes.MessageGroupId) !== null && _a !== void 0 ? _a : '(no-group-id)';
            group[messageGroupId] = group[messageGroupId] || [];
            group[messageGroupId].push(rec);
        }
        const keys = Object.keys(group);
        await Promise.all(keys.map((o) => async () => {
            for (const rec of group[o]) {
                result.push(await handleOneMessage(rec));
            }
        }));
    }
    // Post processing
    if (opts.deleteMessagePolicy === 'never') {
        return null;
    }
    const successResults = result.filter((o) => !o.error);
    const errorRecords = result.filter((o) => o.error).map((o) => o.record);
    if (opts.deleteMessagePolicy === 'always-delete-on-success' || (opts.deleteMessagePolicy === 'auto' && errorRecords.length > 0)) {
        const sqs = new sqs_1.default(option.sqsConfig);
        // Eventually we will delete all the success message and throw error if ncessary.
        for (const res of successResults) {
            const rec = res.record;
            try {
                await sqs.deleteMessage({
                    QueueUrl: getQueueUrl(sqs, rec.eventSourceARN),
                    ReceiptHandle: rec.receiptHandle
                }).promise();
            }
            catch (error) {
                (_b = opts.logger) === null || _b === void 0 ? void 0 : _b.error('Failed to delete processed messages.');
            }
        }
        // Throw error to release error records back to queue population.
        const recordIdentities = errorRecords.map((o) => ({ messageId: o.messageId, messageGroupId: o.attributes.MessageGroupId, body: o.body }));
        throw new Error(`Failed to completely process all SQS events. These ${recordIdentities.length} Error records are: ${JSON.stringify(recordIdentities)}`);
    }
    // Everything has been successfully processed. Let lambda handle deletion.
    return null;
};
//# sourceMappingURL=lambda.sqs.js.map