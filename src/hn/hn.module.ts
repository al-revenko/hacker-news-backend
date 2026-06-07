import { Module } from '@nestjs/common';
import { HnController } from './hn.controller';
import { StoryService } from './story.service';
import { CommentService } from './comment.service';

@Module({
  controllers: [HnController],
  providers: [StoryService, CommentService],
  exports: [StoryService, CommentService],
})
export class HnModule {}
