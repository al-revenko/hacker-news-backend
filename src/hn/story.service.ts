import { Injectable, NotFoundException } from '@nestjs/common';
import { StoryItem, RawStoryItem } from './interfaces';
import { isRawStory } from './hn.guard';
import { fetchFromHn, fetchItemFromHn } from './hn.utils';

@Injectable()
export class StoryService {
  async getTopStories(): Promise<number[]> {
    return fetchFromHn<number[]>('/topstories.json');
  }

  async getNewStories(): Promise<number[]> {
    return fetchFromHn<number[]>('/newstories.json');
  }

  async getBestStories(): Promise<number[]> {
    return fetchFromHn<number[]>('/beststories.json');
  }

  async getStoryById(id: number): Promise<StoryItem> {
    const raw = await fetchItemFromHn(id);
    if (!isRawStory(raw)) {
      throw new NotFoundException(`Story ${id} not found`);
    }
    return this.mapStoryItem(raw);
  }

  async getPaginatedStories(
    storyIds: number[],
    offset: number,
    limit: number,
  ): Promise<{
    data: StoryItem[];
    total: number;
    offset: number;
    limit: number;
  }> {
    const slicedIds = storyIds.slice(offset, offset + limit);

    const stories = await Promise.all(
      slicedIds.map((id) => this.getStoryById(id)),
    );

    return {
      data: stories,
      total: storyIds.length,
      offset,
      limit,
    };
  }

  private mapStoryItem(raw: RawStoryItem): StoryItem {
    return {
      id: raw.id,
      type: raw.type,
      user: raw.by,
      url: raw.url ?? null,
      score: raw.score,
      title: raw.title,
      commentsCount: raw.descendants,
      time: raw.time,
    };
  }
}
