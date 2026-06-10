import { RawItem, RawStoryItem, RawCommentItem } from './interfaces';
import { ItemType } from './hn.const';

export function isRawItem(item: unknown): item is RawItem {
  return item !== null && typeof (item as RawItem).type === 'string';
}

export function isRawComment(item: unknown): item is RawCommentItem {
  return isRawItem(item) && item.type === ItemType.Comment;
}

export function isRawStory(item: unknown): item is RawStoryItem {
  return isRawItem(item) && item.type === ItemType.Story;
}
