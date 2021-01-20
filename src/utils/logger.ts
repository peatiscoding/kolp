import { getClientDevice } from './extractCloudfrontHeader'
import { Request } from 'koa'
export interface Logger {
  log?: (...args: any[]) => void
  debug?: (...args: any[]) => void
  error?: (...args: any[]) => void
  info?: (...args: any[]) => void
  writeLog: (level:string, logMessage: LogMessage) => void
}

export type LogMessage = {
  rawMessage: string
  errorMessage: string
  stackTrace?: string
}

export type Log = {
  custom: string
  traceId: string
  level: string
  storeId?: string
  email?: string
  role?: string
  http?: {
    method: string
    url: string
    protocol: string
    srcIp: string
    statusCode: number
    clientDevice: string
    contentLength: number
  }
  rawMessage: string
  errorMessage: string
  stackTrace?: string
  responseTime?: number
}

export class CLogger implements Logger {

  private startMs: number
  private logObject: Log
  private isDevelopment: boolean
  private project: string

  constructor(req: Request, project: string, isDevelopment: boolean) {
    this.startMs = new Date().getTime()
    this.isDevelopment = isDevelopment
    this.project = project || '-'
    this.logObject.traceId = req.traceId || '-'
    this.logObject.storeId = req.ctx.params.storeId || 'shared'
    this.logObject.email = req.auth
      ? 'System, Vendor consider by function name'
      : req.auth.user.email
    this.logObject.role = req.auth
      ? 'System, Vendor consider by function name'
      : req.auth.user.role
    this.logObject.http.method = req.method || '-'
    this.logObject.http.url = `${req.originalUrl}`
    this.logObject.http.protocol = req.protocol || '-'
    this.logObject.http.srcIp = req.ipAddress || '-'
    this.logObject.http.clientDevice = getClientDevice(req)
    this.logObject.http.contentLength =
      +req.headers['content-length'] || 0
  }

  /**
   * Query elapsed milliseconds.
   *
   * @return milliseconds
   */
  private get elapsedMs(): number {
    return new Date().getTime() - this.startMs
  }
  
  public setLogAction(actionName: string) {
    this.logObject.traceId = `${actionName}-requestId`
  }

  public debug(logMessage: LogMessage) {
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
    this.logObject.responseTime = this.elapsedMs
    this.logObject.errorMessage = logMessage.errorMessage
    this.logObject.rawMessage = logMessage.rawMessage
    this.logObject.stackTrace = logMessage.stackTrace
    if (this.isDevelopment || level === 'DEBUG') {
      console.log(`[${new Date()}] ${this.project} ${this.logObject.level} ${this.logObject.storeId} ${this.logObject.email} ${this.logObject.http.srcIp} "${this.logObject.http.method} ${this.logObject.http.url} ${this.logObject.http.protocol}" ${this.logObject.http.statusCode} ${this.logObject.responseTime} ${this.logObject.http.clientDevice} ERROR:${this.logObject.errorMessage || '-'} MESSAGE:${this.logObject.rawMessage || '-'}`)
    } else if (level !== 'DEBUG') { // Prevent adding debug log to centralized log
      console.log(JSON.stringify({
        ...this.logObject,
        ...logMessage
      }))
    }
  }
}