import { Module } from '@nestjs/common';
import { HnModule } from './hn/hn.module';

@Module({
  imports: [HnModule],
})
export class AppModule {}
