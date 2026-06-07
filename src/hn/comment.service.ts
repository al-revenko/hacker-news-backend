import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentItem, RawCommentItem } from './interfaces';
import { isRawComment, isRawStory } from './hn.guard';
import { fetchItemFromHn } from './hn.utils';

@Injectable()
export class CommentService {
  async getCommentById(id: number, depth: number = 0): Promise<CommentItem> {
    const raw = await fetchItemFromHn(id);
    if (!isRawComment(raw)) {
      throw new NotFoundException(`Comment ${id} not found`);
    }
    const base = this.mapCommentItem(raw);
    if (depth === 0) {
      return base;
    }
    const kids = await this.fetchNestedComments(raw.kids ?? [], depth, 1);
    return { ...base, kids };
  }

  async getCommentsForStory(
    storyId: number,
    depth: number = 0,
  ): Promise<CommentItem[]> {
    const raw = await fetchItemFromHn(storyId);
    if (!isRawStory(raw) || !raw.kids || raw.kids.length === 0) {
      return [];
    }

    return this.fetchNestedComments(raw.kids, depth, 0);
  }

  private async fetchNestedComments(
    rootIds: number[],
    maxDepth: number,
    startDepth: number,
  ): Promise<CommentItem[]> {
    if (startDepth > maxDepth || rootIds.length === 0) {
      return [];
    }

    const commentMap = new Map<number, CommentItem>();
    let currentIds = rootIds;
    let currentDepth = startDepth;

    while (currentDepth <= maxDepth && currentIds.length > 0) {
      const raws = await Promise.all(
        currentIds.map((id) => fetchItemFromHn(id)),
      );
      const validComments = raws.filter(isRawComment);

      const nextIds: number[] = [];
      for (const raw of validComments) {
        const comment: CommentItem = this.mapCommentItem(raw);
        commentMap.set(raw.id, comment);

        if (raw.kids && raw.kids.length > 0 && currentDepth < maxDepth) {
          nextIds.push(...raw.kids);
        }
      }

      currentIds = nextIds;
      currentDepth++;
    }

    for (const comment of commentMap.values()) {
      const parent =
        comment.parent != null ? commentMap.get(comment.parent) : undefined;
      if (parent) {
        parent.kids.push(comment);
      }
    }

    return rootIds
      .map((id) => commentMap.get(id))
      .filter((c): c is CommentItem => c !== undefined);
  }

  private mapCommentItem(raw: RawCommentItem): CommentItem {
    return {
      id: raw.id,
      type: raw.type,
      by: raw.by,
      parent: raw.parent,
      text: raw.text,
      kids: [],
      kidsCount: raw.kids?.length ?? 0,
    };
  }
}
