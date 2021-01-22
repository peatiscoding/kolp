import { getClientDevice } from './extractCloudfrontHeader'
import { KolpServiceContext } from '../context'
import { SQSRecord } from 'aws-lambda'

export interface LoggerInterface {
  log: (...args: any[]) => void
  error: (...args: any[]) => void
  info: (...args: any[]) => void
}

export type ErrorMessage = {
  errorMessage: string
  stackTrace?: string
}

export type Log = {
  custom: string
  traceId?: string
  level?: string
  storeId?: string
  email?: string
  role?: string
  http?: {
    method?: string
    version?: string
    url?: string
    protocol?: string
    srcIp?: string
    statusCode?: number
    clientDevice?: string
    contentLength?: number
  }
  consumer: {
    topic: string
  }
  reqBody?: string
  errorMessage?: string
  stackTrace?: string
  responseTime?: number
}

export type LogType = 'http' | 'sqs'
export type LogLevel = 'INFO' | 'ERROR' | 'DEBUG'
export class Logger implements LoggerInterface {
  private startMs: number
  private logObject: Log
  private service: string
  private logType: LogType
  private logFilterKey: string
  private enabled: boolean

  constructor(
    logFilterKey: string,
    logType: LogType,
    service: string,
    enabled: boolean
  ) {
    this.startMs = new Date().getTime()
    this.service = service || '-'
    this.logType = logType
    this.logFilterKey = logFilterKey
    this.enabled = enabled
  }

  /**
   * Query elapsed milliseconds.
   *
   * @return milliseconds
   */
  private get elapsedMs(): number {
    return new Date().getTime() - this.startMs
  }

  private instanceOfKolpServiceContext(
    object: any
  ): object is KolpServiceContext {
    return object.discriminator === 'context'
  }

  public log(o: any) {
    console.log(o)
  }

  public info(ctx: KolpServiceContext | SQSRecord) {
    if (!this.enabled) return
    this.instanceOfKolpServiceContext(ctx)
      ? this.parseHTTPContextToLogFormat('INFO', ctx)
      : this.parseSQSContextToLogFormat('INFO', ctx)
  }
  public error(
    ctx: KolpServiceContext | SQSRecord,
    errorMessage: ErrorMessage
  ) {
    if (!this.enabled) return
    if (this.instanceOfKolpServiceContext(ctx)) {
      this.parseHTTPContextToLogFormat('ERROR', ctx, errorMessage)
    } else {
      this.parseSQSContextToLogFormat('ERROR', ctx, errorMessage)
    }
  }

  private detemineErrorMessage(errorMessage: ErrorMessage) {
    return errorMessage
      ? {
          errorMessage: errorMessage.errorMessage,
          stackTrace: errorMessage.stackTrace,
        }
      : {
          errorMessage: '-',
          stackTrace: '-',
        }
  }

  private parseHTTPContextToLogFormat(
    level: LogLevel,
    ctx: KolpServiceContext,
    errorMessage?: ErrorMessage
  ): void {
    this.writeLog(level, {
      custom: this.logFilterKey,
      level: level,
      traceId:
        ctx.traceId ||
        `${ctx.req.method}-${ctx.originalUrl}-${ctx.event.requestContext.requestId}`,
      storeId: ctx.params.storeId || 'shared',
      email: ctx.auth && ctx.auth.user ? ctx.auth.user.email : 'Unknown',
      role: ctx.auth && ctx.auth.user ? ctx.auth.user.role : 'Unknown',
      http: {
        method: ctx.req.method || '-',
        url: `${ctx.originalUrl}`,
        version: ctx.req.httpVersion || '-',
        protocol: ctx.request.protocol || '-',
        srcIp: ctx.event.requestContext.identity.sourceIp || '-',
        clientDevice: getClientDevice(ctx),
        contentLength: +ctx.req.headers['content-length'] || 0,
        statusCode: ctx.response.status,
      },
      consumer: {
        topic: '-'
      },
      responseTime: this.elapsedMs,
      reqBody: JSON.stringify(ctx.request.body),
      ...this.detemineErrorMessage(errorMessage),
    })
  }

  private parseSQSContextToLogFormat(
    level: LogLevel,
    rec: SQSRecord,
    errorMessage?: ErrorMessage
  ): void {
    this.writeLog(level, {
      custom: this.logFilterKey,
      level: level,
      traceId: rec?.messageAttributes['traceId']?.stringValue,
      storeId: rec?.messageAttributes['storeId']?.stringValue,
      email: rec?.messageAttributes['email']?.stringValue,
      role: rec?.messageAttributes['role']?.stringValue,
      http: {
        method: '-',
        url: '-',
        version: '-',
        protocol: '-',
        srcIp: '-',
        clientDevice: '-',
        contentLength: 0,
        statusCode: 0,
      },
      consumer: {
        topic: rec.eventSourceARN.split(':').slice(-1)[0]
      },
      responseTime: this.elapsedMs,
      reqBody: JSON.stringify(rec.body),
      ...this.detemineErrorMessage(errorMessage),
    })
  }

  private writeLog(level: LogLevel, log: Log) {
    if (process.env.IS_OFFLINE || level === 'DEBUG') {
      if (this.logType === 'http') {
        console.log(
          `${
            level === 'INFO' ? `\x1b[32m` : `\x1b[31m`
          }[${new Date().toISOString()}] (${this.logType}) ${
            log.level
          } SERVICE:${this.service} STORE:${log.storeId} EMAIL:${
            log.email
          } IP:${log.http.srcIp} "${log.http.method} ${log.http.url} ${
            log.http.protocol
          }/${log.http.version}" ${log.http.statusCode} ${
            log.responseTime
          }_ms DEVICE:${log.http.clientDevice} \n\tERROR:${
            log.errorMessage || '-'
          } \n\tMESSAGE:${log.reqBody || '-'} \n\tSTACKTRACE:${
            log.stackTrace || '-'
          }\x1b[37m`
        )
      } else {
        console.log(
          `${
            level === 'INFO' ? `\x1b[32m` : `\x1b[31m`
          }[${new Date().toISOString()}] (${this.logType}) ${
            log.level
          } TOPIC:${log.consumer.topic} SERVICE:${this.service} STORE:${log.storeId} EMAIL:${log.email} ${
            log.responseTime
          }_ms \n\tERROR:${log.errorMessage || '-'} \n\tMESSAGE:${
            log.reqBody || '-'
          }\n\tSTACKTRACE:${log.stackTrace || '-'}\x1b[37m`
        )
      }
    } else {
      console.log(
        JSON.stringify({
          ...this.logObject,
        })
      )
    }
  }
}
