import { getClientDevice } from './extractCloudfrontHeader'
import { KolpServiceContext } from '../context'
export interface _Logger {
  log?: (...args: any[]) => void
  debug: (...args: any[]) => void
  error: (...args: any[]) => void
  info: (...args: any[]) => void
  writeLog: (level:string, logMessage: LogMessage) => void
}

export type LogMessage = {
  statusCode: number
  rawMessage: string
  errorMessage: string
  stackTrace?: string
}

export type Log = {
  custom: string
  traceId: string
  level?: string
  storeId: string
  email: string
  role: string
  http: {
    method: string
    version: string
    url: string
    protocol: string
    srcIp: string
    statusCode: number
    clientDevice: string
    contentLength: number
  }
  rawMessage?: string
  errorMessage?: string
  stackTrace?: string
  responseTime?: number
}

export type LogType = 'http' | 'sqs' 
export class Logger implements _Logger {

  private startMs: number
  private logObject: Log
  private project: string
  private logType: LogType

  constructor(logFilterKey:string, logType: LogType, project: string, ctx: KolpServiceContext) {
    this.startMs = new Date().getTime()
    this.project = project || '-'
    this.logType = logType
    this.logObject = {
      custom: logFilterKey,
      traceId: ctx.traceId || `${ctx.req.method}-${ctx.originalUrl}-${ctx.requestId}`,
      storeId: ctx.params.storeId || 'shared',
      email: ctx.auth && ctx.auth.user ? ctx.auth.user.email : 'Unknown',
      role: ctx.auth && ctx.auth.user ? ctx.auth.user.role : 'Unknown',
      http: {
        method: ctx.req.method || '-',
        url: `${ctx.originalUrl}`,
        version: ctx.req.httpVersion || '-',
        protocol: ctx.protocol || '-',
        srcIp: ctx.ipAddress || '-',
        clientDevice: getClientDevice(ctx),
        contentLength: +ctx.req.headers['content-length'] || 0,
        statusCode: 0
      }
    }
  }

  /**
   * Query elapsed milliseconds.
   *
   * @return milliseconds
   */
  private get elapsedMs(): number {
    return new Date().getTime() - this.startMs
  }

  public debug(logMessage: LogMessage) {
    console.log(this.logType)
    this.writeLog('DEBUG', logMessage)
  }

  public info(logMessage: LogMessage) {
    this.writeLog('INFO', logMessage)
  }

  public error(logMessage: LogMessage) {
    this.writeLog('ERROR', logMessage)
  }

  public writeLog(level:string, logMessage: LogMessage) {
    this.logObject.level = level
    this.logObject.http.statusCode = logMessage.statusCode
    this.logObject.responseTime = this.elapsedMs
    this.logObject.errorMessage = logMessage.errorMessage
    this.logObject.rawMessage = logMessage.rawMessage
    this.logObject.stackTrace = logMessage.stackTrace
    if (process.env.IS_OFFLINE || level === 'DEBUG') {
      console.log(`[${new Date().toISOString()}] PROJECT:${this.project} STORE:${this.logObject.storeId} ${this.logObject.level} EMAIL:${this.logObject.email} IP:${this.logObject.http.srcIp} "${this.logObject.http.method} ${this.logObject.http.url} ${this.logObject.http.protocol}" ${this.logObject.http.statusCode} ${this.logObject.http.version} ${this.logObject.responseTime} ms ${this.logObject.http.clientDevice} ERROR:${this.logObject.errorMessage || '-'} MESSAGE:${this.logObject.rawMessage || '-'}`)
    } else if (level !== 'DEBUG') { // Prevent adding debug log to centralized log
      console.log(JSON.stringify({
        ...this.logObject,
        ...logMessage
      }))
    }
  }
}