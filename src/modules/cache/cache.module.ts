import { DynamicModule, Logger, Module } from '@nestjs/common';
import {
  CACHE_MANAGER,
  CacheModule as NestCacheModule,
} from '@nestjs/cache-manager';
import { Keyv, KeyvStoreAdapter } from 'keyv';
import { createKeyvNonBlocking } from '@keyv/redis';
import { KeyvCacheableMemory } from 'cacheable';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheService } from './cache.service';

interface CacheModuleOptions {
  defaultTTLms?: number;
  lruSize?: number;
}

@Module({})
export class CacheModule {
  private static logger = new Logger(CacheModule.name);

  static forRoot(options?: CacheModuleOptions): DynamicModule {
    return {
      module: CacheModule,
      global: true,
      imports: [
        NestCacheModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            const stores: (Keyv | KeyvStoreAdapter)[] = [
              new Keyv({
                store: new KeyvCacheableMemory({
                  lruSize: options?.lruSize,
                }),
              }),
            ];

            const redisUrl = configService.get<string>('REDIS_URL');
            if (redisUrl) {
              const redisStore = createKeyvNonBlocking(redisUrl);

              redisStore.on('error', (err) => {
                CacheModule.logger.error('Redis store error:', err);
              });

              stores.push(redisStore);
            }

            return {
              stores,
              ttl: options?.defaultTTLms,
              nonBlocking: true,
            };
          },
        }),
      ],
      providers: [
        {
          provide: CacheService,
          useExisting: CACHE_MANAGER,
        },
      ],
      exports: [NestCacheModule, CacheService],
    };
  }
}
