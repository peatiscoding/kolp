"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SNSClient = exports.SNSMessage = void 0;
const aws_sdk_1 = require("aws-sdk");
// MessageAttributes --> Have to set UseRawMessage (true) on cloudformation template
// https://stackoverflow.com/questions/44238656/how-to-add-sqs-message-attributes-in-sns-subscription/49753291#49753291
class SNSMessage {
    constructor(Subject, Message, TopicArn, MessageAttributes, MessageGroupId) {
        this.Subject = Subject;
        this.Message = Message;
        this.TopicArn = TopicArn;
        this.MessageAttributes = MessageAttributes;
        this.MessageGroupId = MessageGroupId;
    }
    serialized() {
        return {
            Subject: this.Subject,
            Message: JSON.stringify(this.Message),
            TopicArn: this.TopicArn,
            MessageAttributes: this.MessageAttributes,
            MessageGroupId: this.MessageGroupId,
        };
    }
}
exports.SNSMessage = SNSMessage;
class SNSClient {
    constructor(configOrSNS, options) {
        this.options = options;
        if (configOrSNS instanceof aws_sdk_1.SNS) {
            this.client = configOrSNS;
        }
        else {
            this.client = new aws_sdk_1.SNS(configOrSNS);
        }
    }
    /**
     * publish a message to specific queue
     *
     * @param message
     * @returns MessageId
     */
    async publish(message) {
        var _a, _b, _c, _d;
        try {
            const result = await this.client
                .publish(message.serialized())
                .promise();
            if (result.$response.error) {
                throw result.$response.error;
            }
            // Example output 
            // {
            //   ResponseMetadata: { RequestId: '2e7f9e9a-9e99-49f1-90b0-82d900996c9e' },
            //   MessageId: 'cf9c5d63-0f1d-40c3-9a31-9e42da95c371'
            // }
            (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.logger) === null || _b === void 0 ? void 0 : _b.log(`Subject: ${message.Subject}; Message: ${result.MessageId} has been published.`);
            return result.MessageId;
        }
        catch (e) {
            (_d = (_c = this.options) === null || _c === void 0 ? void 0 : _c.logger) === null || _d === void 0 ? void 0 : _d.error('Error from publishing message: ', e);
            throw (e);
        }
    }
}
exports.SNSClient = SNSClient;
//# sourceMappingURL=sns.js.map