import koa from 'koa'
declare module 'koa' {
    interface User {
      name: string
      email: string
      role: string
    }
  
    export interface Request {
  
      /**
       * Injected by Middleware from serverless Engine.
       */
      requestId: string
    
      /**
       * Injected by Middleware from serverless Engine.
       */
      traceId: string

      /**
       * Injected by Middleware from serverless Engine.
       */
      ipAddress: string
  
      /**
       * Injected by Middleware from serverless Engine.
       */
      userAgent: string
  
      /**
       * API Gateway proxy's stages variables.
       *
       * Injected by shared/utils/serverless.http.ts
       */
      stageVariables: { [key: string]: string }
  
      /**
       * Injected by shared/utils/middlewares/withConfig.ts
       */
    //   context: InCartServiceContext
  
      /**
       * Injected by custom authorizer lambda
       */
      auth: {
        user: User
      }
    }
  }