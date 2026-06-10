import { Module } from '@nestjs/common';
import { HnModule } from './modules/hn/hn.module';

@Module({
  imports: [HnModule],
})
export class AppModule {}
