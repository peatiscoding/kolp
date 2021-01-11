// Informational responses (100–199)
// Successful responses (200–299)
// Redirects (300–399)
// Client errors (400–499)
// Server errors (500–599)

// SEE https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

export enum SuccessCode {
  /**
   * Success!
   */
  ok = 200,
  /**
   * Resource has been created, usually reply upon creation/update
   */
  created = 201,
  /**
   * Request has been accepted to process, put on the queue, and still waiting for response.
   */
  accepted = 202,
  /**
   * Grabbing the resource that has no content. But header might be useful.
   */
  noContent = 204,
  /**
   * Content of this request has been reset.
   */
  reset = 205,
  /**
   * Use this when there is a range of content to be sent over. Example (Audio/Video streams).
   */
  partial = 206,
}

export enum RedirectonCode {
  /**
   * 
   */
  permanent = 301,
  /**
   * 
   */
  temporarily = 302,
}

export enum ClientErrorCode {
  /**
   * Incoming input doesn't make sense, invalid syntax, invalid format.
   */
  badRequest = 400,
  /**
   * The request is not authorized.
   */
  unauthorized = 401,
  /**
   * Payment is required.
   */
  paymentRequired = 402,
  /**
   * User is already authenticated, but does not have sufficient permission to access the resource
   */
  forbidden = 403,
  /**
   * The actual resource is not available on the server, This usually have to pass through 400 ~ 403 first
   * before emit this error code.
   */
  notFound = 404,
  /**
   * Method is not allowed, the HTTP verb is not supported at ths endpoint.
   */
  methodNotAllowed = 405,
}

export enum ServerErrorCode {
  /**
   * Unhandled situation, use this when underlying error failed to produce an expected result.
   */
  internalServerError = 500,
  /**
   * The service or endpoint is not yet implemented.
   */
  notImplemented = 501,
  /**
   * The underlying service failed to deliver the expected response.
   */
  badGateway = 502,
  /**
   * The service went down form maintenance,
   */
  unavailable = 503,
  /**
   * The underlying service took too long to response.
   */
  gatewayTimeout = 504,
}

export type ErrorCode = ClientErrorCode | ServerErrorCode
export type ResponseCode = SuccessCode | RedirectonCode | ErrorCode 
