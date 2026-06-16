import { Module } from '@nestjs/common';
import { HnModule } from './modules/hn/hn.module';
import { CacheModule } from './modules/cache/cache.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.forRoot({
      defaultTTLms: 300000,
      lruSize: 1000,
    }),
    HnModule,
  ],
})
export class AppModule {}
