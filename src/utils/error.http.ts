import { ErrorCode, ClientErrorCode, ServerErrorCode } from './response'

export class KolpError extends Error {

  constructor(public readonly statusCode: ErrorCode, message: string, public readonly data?: any) {
    super(message)
  }

  /**
   * Error due to Client side input
   * 
   * @param code
   * @param message
   * @param data
   */
  static fromUserInput(code: ClientErrorCode, message: string, data?: any): KolpError {
    return new KolpError(code, message, data)
  }

  /**
   * Error due to Service side logic
   * 
   * @param code
   * @param message
   * @param data
   */
  static fromServer(code: ServerErrorCode, message: string, data?: any): KolpError {
    return new KolpError(code, message, data)
  }
}
