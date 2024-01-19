# Kolp

"jetpack for building microservice on Lambda"

Accronym for Koa on Lambda (Pack). A tiny library toolbox for Lambda (using Koa, Koa Router) then describe your endpoints with controllers.

**Version 2:**

- Updated npm package dependencies to use aws-sdk v3 instead.

## Install

```
npm i --save kolp

# OR

yarn kolp
```

**NOTE** we listed `koa` as our `peerDependencies` so please include the `koa` in your own codebase.

## Usage

Start your typescript Lambda project. Describe your endpoints with Controller style.

To expose each method as routes. Use our built-in decorator. `Route` which accepts method, paths, and Koa's middlwares.

`controllers/hello.cotnroller.ts`

```ts
import type { Context } from 'koa'
import { Route, BaseRoutedController } from 'kolp'

export class HelloController extends BaseRoutedController {

  @Route('post', '/echo')
  async migrate(context: Context) {
    return context.request
  }

  @Route()
  async index(context: Context) {
    return {
      hello: 'world'
    }
  }
}
```

Or you can describe your controllers in a classical way. (Avoid using decorators). This method introduce less code when it is bundled.

`controllers/hello.controller.ts`

```ts
import type { Context } from 'koa'
import { RouteMap, BaseRoutedController } from 'kolp'

export class HelloController extends BasedRouteController {

  public getRouteMaps(): RouteMap {
    return {
      ...super.getRouteMaps(),
      index: { method: 'get', path: '/', middlewares: [] }, // Same as our decorator above.
    }
  }

  async index(context: Context) {
    return {
      hello: 'world'
    }
  }
}
```

Now to use these controllers. You will need to map them to paths in the Lambda's handler. Instead of creating your own handler from scratch. Just use `makeServerWithRouter` method to create your handler function.

The function itself allow you to customize the created `router` (Root router). Here is the example.

`handler.ts`

```ts
import 'source-map-support/register'
import { makeServerWithRouter, withJson } from 'kolp'

import { HelloController } from './controllers/hello.controller'

export default makeServerWithRouter((router) => {
  router.prefix('/hello')
    .use(withJson())    // Json error handler!
  
  // Register your controllers here.
  new HelloController().register('/hi', router)
})
```

By the example above. You will be able to:

```bash
curl -XGET http://localhost:9000/hello/hi
```

## TODO

```
[ ] Example repo
[ ] Inter Service Communication
[X] SNS/SQS Handler
```
