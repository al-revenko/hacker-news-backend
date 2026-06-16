import { Injectable, NotFoundException } from '@nestjs/common';
import { fetchItemFromHn, isRawComment } from './hn.utils';
import { CommentItem, RawCommentItem } from './types';
import { CacheService } from '../cache';

const COMMENTS_CACHE_TTL = 5 * 60 * 1000;

type CacheOptions = {
  useCache?: boolean;
  ttl?: number;
};

@Injectable()
export class CommentService {
  constructor(private readonly cacheService: CacheService) {}

  async getCommentsByIds(
    ids: number[],
    options: CacheOptions = {},
  ): Promise<CommentItem[]> {
    const { useCache = true, ttl = COMMENTS_CACHE_TTL } = options;

    let cachedComments: (CommentItem | undefined)[] = [];

    if (useCache) {
      const keys = ids.map((id) => this.createCommentCacheKey(id));
      cachedComments = await this.cacheService.mget<CommentItem>(keys);
    }

    const comments: CommentItem[] = await Promise.all(
      ids.map(async (id, index) => {
        if (useCache) {
          const cachedComment = cachedComments[index];

          if (cachedComment) {
            return cachedComment;
          }
        }

        const raw = await fetchItemFromHn(id);
        if (!isRawComment(raw)) {
          throw new NotFoundException(`Comment ${id} not found`);
        }

        const commentItem = this.mapCommentItem(raw);
        if (useCache) {
          await this.cacheService.set(
            this.createCommentCacheKey(id),
            commentItem,
            ttl,
          );
        }

        return commentItem;
      }),
    );

    return comments;
  }

  private mapCommentItem(raw: RawCommentItem): CommentItem {
    return {
      id: raw.id,
      type: raw.type,
      user: raw.by,
      parent: raw.parent,
      text: raw.text,
      kidsId: raw.kids ?? [],
      descendantsCount: raw.kids?.length ?? 0,
      time: raw.time,
    };
  }

  private createCommentCacheKey(id: number | string): string {
    return `comment:${id}`;
  }
}
