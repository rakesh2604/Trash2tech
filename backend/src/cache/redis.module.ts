import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: () => {
        const host = process.env.REDIS_HOST || 'localhost';
        const port = Number(process.env.REDIS_PORT) || 6379;
        const client = new Redis({ host, port, maxRetriesPerRequest: 2 });
        client.on('error', (err) => {
          // Avoid unhandled error spam when Redis is not running
          if (process.env.NODE_ENV !== 'test') {
            // eslint-disable-next-line no-console
            console.warn('[Redis] Connection issue (is Redis running?):', err?.message || err);
          }
        });
        return client;
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
