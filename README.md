<p align="center">
  <a href="https://unsoon.com">
    <img src="https://i.ibb.co/Wcvbtsm/unsoon.png" width="200" alt="Unsoon Logo">
    <h3 align="center">Unsoon</h3>
  </a>
</p>

## Description

Welcome to Unsoon, a rate-limiting package that helps you manage and control the rate of incoming requests to your application. This package provides various features and options to configure and customize the rate limiting behavior. By integrating this package into your project, you can prevent abuse, protect against DDoS attacks, and ensure fair usage of your resources.

## Installation

You can install the package via `npm`, `yarn`, or `pnpm`. Run the following command in your project directory:

```bash
# npm
npm install --save @unsoon/rate-limit

# yarn
yarn add @unsoon/rate-limit

# pnpm
pnpm add @unsoon/rate-limit
```

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usages](#usages)
  - [RateLimitModule](#ratelimitmodule)
    - [Object configuration](#object-configuration)
    - [Callback configuration](#callback-configuration)
  - [Store](#store)
  - [Timeout](#timeout)
  - [Ignoring specific user agents](#ignoring-specific-user-agents)
  - [Error message](#error-message)
  - [Headers](#headers)
  - [Decorators](#decorators)
    - [@RateLimit()](#ratelimit)
      - [Object configuration](#object-configuration-1)
      - [Callback configuration](#callback-configuration-1)
    - [@SkipRateLimit()](#skipratelimit)
      - [Skipping a route or class](#skipping-a-route-or-class)
      - [Skipping with conditions](#skipping-with-conditions)
  - [Proxies](#proxies)
  - [Working with GraphQL](#working-with-graphql)
  - [Working with Websockets](#working-with-websockets)
- [License](#license)

## Usages

### RateLimitModule

The `RateLimitModule` in the `@unsoon/rate-limit` package provides a flexible and configurable way to apply rate limiting to your application. It allows you to set rate limit parameters using an object or a callback function, giving you the ability to customize the rate limiting behavior based on different conditions.

When configuring the `RateLimitModule`, you have two options for setting rate limit parameters: an object or a callback function.

#### Object Configuration

You can set the rate limit parameters using an object that defines the following properties:

- `limit`: The maximum number of requests allowed within the specified time window.
- `window`: The duration (in milliseconds) of the time window during which the rate limit applies.
- `store`: The storage mechanism to track and enforce rate limits.
- `timeout`: The duration (in milliseconds) after which the rate limit expires (optional).

Here's an example of setting rate limit parameters using an object:

```ts
import { Module } from '@nestjs/common';
import { MemoryStore, RateLimitModule } from '@unsoon/rate-limit';

@Module({
  imports: [
    RateLimitModule.forRoot({
      limit: 100,
      window: 60000,
      store: new MemoryStore(),
      timeout: 300000,
    }),
  ],
})
export class AppModule {}
```

In the example above, the rate limit parameters are set using an object. The rate limit is configured to allow a maximum of 100 requests within a 60-second window. The `MemoryStore` is used as the storage mechanism to track and enforce the rate limits. Additionally, a timeout of 300,000 milliseconds (5 minutes) is set, after which the rate limit will expire.

#### Callback Configuration

Alternatively, you can use a callback function to dynamically set the rate limit parameters based on the incoming request. The callback function receives the request as a parameter and should return an object with the rate limit parameters.

Here's an example of setting rate limit parameters using a callback function:

```ts
import { Module } from '@nestjs/common';
import { MemoryStore, RateLimitModule } from '@unsoon/rate-limit';
import { Request } from 'express';

@Module({
  imports: [
    RateLimitModule.forRoot((req: Request) => {
      // Custom logic to determine rate limit parameters based on the request
      const limit = req.path === '/public' ? 1000 : 100;
      const window = req.path === '/public' ? 3600000 : 60000;

      return {
        limit,
        window,
        store: new MemoryStore(),
        timeout: 300000,
      };
    }),
  ],
})
export class AppModule {}
```

In the example above, a callback function is used to dynamically determine the rate limit parameters based on the request. If the request path is `/public`, a higher rate limit of 1000 requests within a 1-hour window is set. For other paths, a rate limit of 100 requests within a 1-minute window is set. The `MemoryStore` is used as the storage mechanism, and a timeout of 300,000 milliseconds is configured.

Using a callback function allows you to make different rate limit configurations based on various conditions, such as the request path, request headers, or user roles. This flexibility enables you to apply rate limiting strategies that are specific to different parts of your application or different types of requests.

You can also configure the `RateLimitModule` asynchronously by using the `forRootAsync` method. This allows you to inject configuration values dynamically, such as from a configuration service:

```ts
@Module({
  imports: [
    RateLimitModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        limit: +config.get('RT_LIMIT'),
        window: +config.get('RT_WINDOW'),
        store: new MemoryStore(),
      }),
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
  ],
})
export class AppModule {}
```

By adding the `RateLimitGuard` as a global guard in your `AppModule`, all incoming requests will be subjected to rate limiting by default. Alternatively, you can use the `@UseGuards(RateLimitGuard)` decorator on specific routes or controllers to apply rate limiting only to those endpoints.

Example with `@UseGuards(RateLimitGuard)`:

```ts
// app.module.ts
@Module({
  imports: [
    RateLimitModule.forRoot({
      limit: 10,
      window: 5_000,
      store: new MemoryStore(),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// app.controller.ts
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(RateLimitGuard)
  getHello(): string {
    return this.appService.getHello();
  }
}
```

### Store

Package provides different store options for tracking requests and enforcing rate limits. Currently, the following store options are available:

- `Memory Store`: This is the default store and stores request data in memory. It is suitable for single-server deployments or environments where high scalability is not a requirement. However, note that the memory store does not provide persistence, and rate limit data will be lost on server restarts.

- `Redis Store`: This store utilizes Redis, an in-memory data structure store, to store rate limit data. Redis provides persistence and scalability, making it a good choice for distributed systems or when high availability is required. To use the Redis store, you need to install the redis package and configure the connection details.

- `Custom Store`: Unsoon allows you to implement a custom store by extending the RateLimitStore abstract class. This gives you the flexibility to integrate with any data store or backend system of your choice.

When using the Redis store, you need to provide a function that sends commands to Redis. The function should have the following signature:

```ts
(...args: string[]) => Promise<unknown>;
```

`RateLimitStoreValues` type:

```ts
export interface RateLimitStoreValues extends Record<string, any> {
  /**
   * The number of requests made.
   */
  count: number;
  /**
   * The number of requests remaining in the current rate limit window.
   */
  remaining: number;
}
```

The actual command sending function varies depending on the Redis library you are using. Here are some examples of the function for different Redis libraries:

| Library                                                            | Function                                                          |
| ------------------------------------------------------------------ | ----------------------------------------------------------------- |
| [`node-redis`](https://github.com/redis/node-redis)                | `async (...args: string[]) => client.sendCommand(args)`           |
| [`ioredis`](https://github.com/luin/ioredis)                       | `async (...args: string[]) => client.call(...args)`               |
| [`handy-redis`](https://github.com/mmkal/handy-redis)              | `async (...args: string[]) => client.nodeRedis.sendCommand(args)` |
| [`tedis`](https://github.com/silkjs/tedis)                         | `async (...args: string[]) => client.command(...args)`            |
| [`redis-fast-driver`](https://github.com/h0x91b/redis-fast-driver) | `async (...args: string[]) => client.rawCallAsync(args)`          |
| [`yoredis`](https://github.com/djanowski/yoredis)                  | `async (...args: string[]) => (await client.callMany([args]))[0]` |
| [`noderis`](https://github.com/wallneradam/noderis)                | `async (...args: string[]) => client.callRedis(...args)`          |

Here are a couple of examples showing how to use the package with different Redis clients:

Example with a [`node-redis`](https://github.com/redis/node-redis) client:

```ts
import { Module } from '@nestjs/common';
import { RateLimitModule, RedisStore } from '@unsoon/rate-limit';
import { createClient } from 'redis';

const redis = createClient({ url: process.env.REDIS_URL });

redis.connect();

@Module({
  imports: [
    RateLimitModule.forRoot({
      limit: 2,
      window: 1000,
      store: new RedisStore((...args: Array<string>) => redis.sendCommand(args)),
    }),
  ],
})
export class AppModule {}
```

Example with a [`ioredis`](https://github.com/luin/ioredis) client:

```ts
import { Module } from '@nestjs/common';
import { RateLimitModule, RedisStore } from '@unsoon/rate-limit';
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

@Module({
  imports: [
    RateLimitModule.forRoot({
      limit: 2,
      window: 1000,
      store: new RedisStore((...args: Array<string>) => redis.call(args[0], ...args.slice(1))),
    }),
  ],
})
export class AppModule {}
```

In these examples, the Redis client is created and configured based on the specific library used (node-redis or ioredis). The Redis store is then instantiated with the provided command sending function, allowing the package to interact with Redis for rate limiting purposes.

### Timeout

The `RateLimitModule` provides a `timeout` option that allows you to specify the duration (in milliseconds) after which the rate limit will expire. This timeout value determines how long the rate limit will be enforced for a specific client.

If the `timeout` option is not explicitly set, the module will use the value of the `window` option as the default timeout. This means that the rate limit will be enforced for the duration specified by the `window` option if no explicit `timeout` value is provided.

Here's an example that demonstrates setting the `timeout` option:

```ts
import { Module } from '@nestjs/common';
import { MemoryStore, RateLimitModule } from '@unsoon/rate-limit';

@Module({
  imports: [
    RateLimitModule.forRoot({
      limit: 100,
      window: 60000,
      store: new MemoryStore(),
      timeout: 300000, // Set a timeout of 5 minutes
    }),
  ],
})
export class AppModule {}
```

In the example above, the `timeout` option is set to `300000` milliseconds, which corresponds to a timeout of 5 minutes. This means that the rate limit for a specific client will be enforced for 5 minutes before expiring.

If you omit the `timeout` option, the module will automatically use the value of the `window` option as the default timeout. For example, if the `window` is set to `60000` milliseconds (1 minute), the rate limit will be enforced for 1 minute by default.

By specifying a custom `timeout` value, you can control how long the rate limit will be active for a client. This allows you to set different timeouts based on your application's needs and the desired rate limiting behavior.

Keep in mind that the `timeout` value is optional, and if not provided, the module will fall back to using the `window` value as the default timeout.

### Ignoring specific user agents

The package also provides a feature to ignore specific user agents from rate limiting. You can use the `ignoreUserAgents` key to specify regular expressions or patterns for user agents that should be excluded from rate limiting.

In the `app.module.ts` file, you can configure the `ignoreUserAgents` option when setting up the module:

```ts
@Module({
  imports: [
    RateLimitModule.forRoot({
      // ...
      ignoreUserAgents: [
        // Don't throttle requests that have 'googlebot' defined in their user agent.
        // Example user agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)
        /googlebot/gi,

        // Don't throttle requests that have 'bingbot' defined in their user agent.
        // Example user agent: Mozilla/5.0 (compatible; Bingbot/2.0; +http://www.bing.com/bingbot.htm)
        new RegExp('bingbot', 'gi'),
      ],
    }),
  ],
})
export class AppModule {}
```

Here, the `ignoreUserAgents` array contains regular expressions or patterns for user agents that should be ignored. Requests with user agents matching these patterns will not be subject to rate limiting.

You can also specify the `ignoreUserAgents` option in the `@RateLimit()` decorator to exclude specific user agents from rate limiting for a particular route or controller:

```ts
@RateLimit({
  ignoreUserAgents: [
    // Don't throttle requests that have 'googlebot' defined in their user agent.
    // Example user agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)
    /googlebot/gi,

    // Don't throttle requests that have 'bingbot' defined in their user agent.
    // Example user agent: Mozilla/5.0 (compatible; Bingbot/2.0; +http://www.bing.com/bingbot.htm)
    new RegExp('bingbot', 'gi'),
  ],
})
export class AppController {
  // ...
}
```

By specifying the `ignoreUserAgents` option in the decorator, requests matching the specified user agents will not be rate limited for that particular route or controller.

This feature allows you to selectively exclude certain user agents from rate limiting, which can be useful for accommodating search engine crawlers or other bots that you don't want to restrict.

### Error message

To change the error message displayed when the rate limit is exceeded, you can use the `errorMessage` option provided by the `RateLimitModule`. By default, the module uses a generic error message, but you can customize it to provide more specific information to the client.

Here's an example of how to set a custom error message:

```ts
@Module({
  imports: [
    RateLimitModule.forRoot({
      // ...
      errorMessage: 'Oops! You have exceeded the rate limit. Please try again later.',
    }),
  ],
})
export class AppModule {}
```

In the example above, the `errorMessage` option is set to the desired error message. When a request exceeds the rate limit, this custom error message will be sent as the response to the client.

By providing a meaningful error message, you can communicate the reason for the rate limit restriction and inform the client about when they can retry their request.

Feel free to modify the `errorMessage` option to suit your specific use case and provide an appropriate error message to your clients.

### Headers

The `RateLimitModule` automatically adds several headers to the response to provide rate limit information. Here are the headers that are included:

- `x-rate-limit`: Indicates the maximum number of requests the client can make within the defined time window.
- `x-rate-remaining`: Indicates the number of requests remaining for the client within the current time window.
- `x-rate-reset`: Specifies the number of seconds remaining until the rate limit resets and the client can make new requests.
- `retry-after`: If the maximum number of requests has been reached, this header specifies the number of milliseconds the client must wait before making new requests.

By default, these headers are included in the response. However, if you don't need these headers or want to disable them, you can set the `includeHeaders` option to `false` when configuring the `RateLimitModule`. Here's an example:

```ts
@Module({
  imports: [
    RateLimitModule.forRoot({
      // ...
      includeHeaders: false, // Disable all rate limit headers
    }),
  ],
})
export class AppModule {}
```

Setting `includeHeaders` to `false` will prevent the module from adding the rate limit headers to the response.

### Decorators

The package provides two decorators that can be used to control rate limiting on specific routes or controllers.

#### @RateLimit()

The `@RateLimit()` decorator allows you to specify rate limiting options for individual routes or controllers. It can be applied like this:

```ts
import { Controller, Get } from '@nestjs/common';
import { RateLimit } from '@unsoon/rate-limit';

@Controller('users')
export class UsersController {
  @Get()
  @RateLimit({ limit: 100, window: 60000 }) // Allow 100 requests per minute
  getUsers() {
    // Handle GET /users request
  }
}
```

You can configure the rate limit options using an object or a callback function.

#### Object Configuration

You can specify the rate limit options using an object. Here's an example:

```ts
@RateLimit({ limit: 10, window: 3600 * 1000, errorMessage: 'You can only make 10 requests every hour' })
```

In this case, the `limit` property specifies the maximum number of requests allowed within the defined `window` period (in milliseconds). The `message` property can be used to provide a custom error message when the rate limit is exceeded.

#### Callback Configuration

Alternatively, you can use a callback function to dynamically determine the rate limit options based on request parameters. Here's an example:

```ts
@RateLimit((req: Request) => req.user.isPremium ? { limit: 100 } : { limit: 10 })
```

In this example, the rate limit options are determined based on the isPremium property of the req.user object. If the user is premium, a higher limit of 100 requests is allowed; otherwise, a limit of 10 requests is enforced.

#### @SkipRateLimit()

The `@SkipRateLimit()` decorator allows you to skip rate limiting for specific routes or controllers. It can be used in the following ways:

#### Skipping a Route or Class

To skip rate limiting for a specific route or class, you can apply the `@SkipRateLimit()` decorator without any parameters. Here's an example:

```ts
@SkipRateLimit()
@Controller()
export class AppController {
  @SkipRateLimit(false)
  dontSkip() {}

  doSkip() {}
}
```

In this example, the `dontSkip` method is rate-limited, while the `doSkip` method is not limited in any way.

#### Skipping with Conditions

You can also use the `skipIf` parameter to skip rate limiting based on specific conditions. Here's an example:

```ts
@Controller()
export class AppController {
  @RateLimit({ skipIf: true }) // or @RateLimit({ skipIf: (req: Request) => !!req.user.isAdmin })
  dontSkip() {}

  doSkip() {}
}
```

In this example, the `dontSkip` method would be rate-limited unless the `skipIf` condition is true. The condition can be a boolean value or a callback function that evaluates the request object to determine whether to skip rate limiting.

By using the `@RateLimit()` and `@SkipRateLimit()` decorators, you have fine-grained control over rate limiting for your routes and controllers, allowing you to customize the behavior based on your specific requirements.

### Proxies

If you are working behind a proxy, you may need to configure the `trust proxy` option in the specific HTTP adapter you are using, such as Express or Fastify. Enabling this option allows you to obtain the original IP address from the `X-Forwarded-For` header. You can override the `getFingerprint()` method in the `RateLimitGuard` class and extract the IP address from the header instead of using `req.ip`. Here's an example that works with both Express and Fastify:

```ts
// rate-limit-behind-proxy.guard.ts
import { ExecutionContext, Injectable } from '@unsoon/rate-limit';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RateLimitBehindProxyGuard extends RateLimitGuard {
  override getFingerprint(context: ExecutionContext): string {
    const { request } = super.getRequestResponse(context);
    return request.ips.length ? request.ips[0] : request.ip; // Individualize IP extraction to meet your own needs
  }
}

// app.controller.ts
import { Controller, UseGuards } from '@nestjs/common';
import { RateLimitBehindProxyGuard } from './rate-limit-behind-proxy.guard.ts';

@UseGuards(RateLimitBehindProxyGuard)
@Controller()
export class AppController {
  // ...
}
```

```ts
// app.module.ts
@Module({
  imports: [
    RateLimitModule.forRoot({
      // ...
      fingerprint: (req: Request) => (req.ips.length ? req.ips[0] : req.ip),
    }),
  ],
})
export class AppModule {}
```

```ts
// app.controller.ts
@RateLimit({
  fingerprint: (req: Request) => (req.ips.length ? req.ips[0] : req.ip),
})
export class AppController {
  // ...
}
```

In the above examples, the `RateLimitBehindProxyGuard` class extends the `RateLimitGuard` provided by the package and overrides the `getFingerprint()` method to extract the IP address from the `ips` property or `ip` property of the request object, depending on the presence of a proxy. The `RateLimitBehindProxyGuard` class is then used as a guard in the controller by applying the `@UseGuards()` decorator or as an option in the `RateLimitModule.forRoot()` configuration.

### Working with GraphQL

To get the `RateLimitModule` to work with the GraphQL context, a couple of things must happen.

- You must use `Express` and `apollo-server-express` as your GraphQL server engine. This is
  the default for Nest, but the [`apollo-server-fastify`](https://github.com/apollographql/apollo-server/tree/master/packages/apollo-server-fastify) package does not currently support passing `res` to the `context`, meaning headers cannot be properly set.
- When configuring your `GraphQLModule`, you need to pass an option for `context` in the form
  of `({ req, res}) => ({ req, res })`. This will allow access to the Express Request and Response
  objects, allowing for the reading and writing of headers.

```ts
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      // ...
      context: ({ req, res }) => ({ req, res }),
    }),
  ],
})
export class AppModule {}
```

- You must add in some additional context switching to get the `ExecutionContext` to pass back values correctly (or you can override the method entirely)

```ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RateLimitGuard } from '@unsoon/rate-limit';
import { Request, Response } from 'express';

@Injectable()
export class GqlRateLimitGuard extends RateLimitGuard {
  getRequestResponse(context: ExecutionContext): {
    request: Request;
    response: Response;
  } {
    const { req: request, res: response } = GqlExecutionContext.create(context).getContext();

    return { request, response }; // ctx.request and ctx.reply for fastify
  }
}
```

### Working with Websockets

Here's an example of how to work with Websockets using the `RateLimitGuard` and customizing the error handling:

```ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { RateLimitGuard } from '@unsoon/rate-limit';

@Injectable()
export class WsRateLimitGuard extends RateLimitGuard {
  protected override getFingerprint(context: ExecutionContext) {
    return ['conn', '_socket']
      .map((key) => context.switchToWs().getClient()[key])
      .filter((obj) => obj)
      .shift().remoteAddress;
  }
}
```

To handle exceptions and errors when working with Websockets, you can create a custom filter:

```ts
import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(WsException, HttpException)
export class WsExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: WsException | HttpException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();

    const error = exception instanceof WsException ? exception.getError() : exception.getResponse();

    const details = error instanceof Object ? { ...error } : { message: error };

    client.emit('error', details);
  }
}
```

Then, in your WebSocket gateway or controller, apply the rate limit guard and exception filter:

```ts
import { UseFilters, UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { WsRateLimitGuard } from './ws-rate-limit.guard';
import { WsExceptionsFilter } from './ws-exceptions.filter';

@UseFilters(WsExceptionsFilter)
@WebSocketGateway()
export class AppGateway {
  @UseGuards(WsRateLimitGuard)
  @SubscribeMessage('message')
  handleMessage(): string {
    return 'Hello world!';
  }
}
```

Make sure to apply the `@UseGuards(WsRateLimitGuard)` decorator to the WebSocket handler or gateway method to enable rate limiting for Websockets. The `@UseFilters(WsExceptionsFilter)` decorator is used to handle exceptions and errors thrown during the WebSocket communication.

With these implementations, you can effectively apply rate limiting and handle exceptions when working with Websockets in NestJS.

## License

MIT © [Unsoon Social](http://github.com/unsoon)
