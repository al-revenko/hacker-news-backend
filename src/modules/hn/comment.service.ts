import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentItem, RawCommentItem } from './interfaces';
import { isRawComment } from './hn.guard';
import { fetchItemFromHn } from './hn.utils';

@Injectable()
export class CommentService {
  async getCommentsByIds(ids: number[]): Promise<CommentItem[]> {
    const comments: CommentItem[] = [];

    for (const id of ids) {
      const raw = await fetchItemFromHn(id);
      if (!isRawComment(raw)) {
        throw new NotFoundException(`Comment ${id} not found`);
      }
      comments.push(this.mapCommentItem(raw));
    }

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
}
