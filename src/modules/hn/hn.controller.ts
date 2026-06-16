import {
  Controller,
  Get,
  Param,
  Query,
  BadRequestException,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StoryService } from './story.service';
import { CommentService } from './comment.service';
import { PaginationDto, GetCommentsBodyDto } from './dto';
import { Cache } from '../cache';

const STORY_TTL_MS = 600000;

@Controller('hn')
export class HnController {
  constructor(
    private readonly storyService: StoryService,
    private readonly commentService: CommentService,
  ) {}

  @Cache(STORY_TTL_MS)
  @Get('story/new')
  async getNewStories(@Query() query: PaginationDto) {
    const { offset = 0, limit = 20 } = query;
    return this.storyService.getPaginatedStories(
      await this.storyService.getNewStories(),
      offset,
      limit,
    );
  }

  @Cache(STORY_TTL_MS)
  @Get('story/best')
  async getBestStories(@Query() query: PaginationDto) {
    const { offset = 0, limit = 20 } = query;
    return this.storyService.getPaginatedStories(
      await this.storyService.getBestStories(),
      offset,
      limit,
    );
  }

  @Cache(STORY_TTL_MS)
  @Get('story/:id')
  async getStory(@Param('id') id: string) {
    const storyId = this.parseAndValidateId(id, 'story');
    return this.storyService.getStoryById(storyId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('comments')
  async getComments(@Body() body: GetCommentsBodyDto) {
    const { ids } = body;

    return this.commentService.getCommentsByIds(ids, { useCache: true });
  }

  private parseAndValidateId(id: string, type: string): number {
    const parsed = parseInt(id, 10);
    if (isNaN(parsed)) {
      throw new BadRequestException(`Invalid ${type} ID: ${id}`);
    }
    return parsed;
  }
}
