import { ItemType } from '../hn.const';

export interface Item {
  id: number;
  type: ItemType;
}

export interface StoryItem extends Item {
  type: ItemType.Story;
  user: string;
  url: string | null;
  score: number;
  title: string;
  commentsCount: number;
  commentsId: number[];
  time: number;
}

export interface CommentItem extends Item {
  type: ItemType.Comment;
  user: string;
  parent: number | null;
  text: string;
  kidsId: number[];
  descendantsCount: number;
  time: number;
}

export interface RawStoryItem {
  id: number;
  type: ItemType.Story;
  title: string;
  url: string | null;
  score: number;
  by: string;
  time: number;
  descendants: number;
  kids?: number[];
}

export interface RawCommentItem {
  id: number;
  type: ItemType.Comment;
  text: string;
  by: string;
  time: number;
  parent: number;
  kids?: number[];
}

export type RawItem = RawStoryItem | RawCommentItem;
