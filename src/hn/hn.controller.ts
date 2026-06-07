import {
  Controller,
  Get,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { StoryService } from './story.service';
import { CommentService } from './comment.service';
import { PaginationDto } from './dto/pagination.dto';
import { DepthDto } from './dto/depth.dto';

@Controller('hn')
export class HnController {
  constructor(
    private readonly storyService: StoryService,
    private readonly commentService: CommentService,
  ) {}

  @Get('story/new')
  async getNewStories(@Query() query: PaginationDto) {
    const { offset = 0, limit = 20 } = query;
    return this.storyService.getPaginatedStories(
      await this.storyService.getNewStories(),
      offset,
      limit,
    );
  }

  @Get('story/best')
  async getBestStories(@Query() query: PaginationDto) {
    const { offset = 0, limit = 20 } = query;
    return this.storyService.getPaginatedStories(
      await this.storyService.getBestStories(),
      offset,
      limit,
    );
  }

  @Get('story/:id')
  async getStory(@Param('id') id: string) {
    const storyId = this.parseAndValidateId(id, 'story');
    return this.storyService.getStoryById(storyId);
  }

  @Get('story/:id/comments')
  async getStoryComments(@Param('id') id: string, @Query() query: DepthDto) {
    const storyId = this.parseAndValidateId(id, 'story');
    const comments = await this.commentService.getCommentsForStory(
      storyId,
      query.depth ?? 0,
    );
    return comments;
  }

  @Get('comment/:id')
  async getComment(@Param('id') id: string, @Query() query: DepthDto) {
    const commentId = this.parseAndValidateId(id, 'comment');
    return this.commentService.getCommentById(commentId, query.depth ?? 0);
  }

  private parseAndValidateId(id: string, type: string): number {
    const parsed = parseInt(id, 10);
    if (isNaN(parsed)) {
      throw new BadRequestException(`Invalid ${type} ID: ${id}`);
    }
    return parsed;
  }
}
