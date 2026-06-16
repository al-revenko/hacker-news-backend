import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { applyDecorators, UseInterceptors } from '@nestjs/common';

export interface CacheOptions {
  key?: string;
  ttl?: number;
}

export function Cache(ttl?: number): MethodDecorator;
export function Cache(key?: string): MethodDecorator;
export function Cache(options?: CacheOptions): MethodDecorator;
export function Cache(value: CacheOptions | number | string = {}) {
  let ttl: number | undefined = undefined;
  let key: string | undefined = undefined;

  switch (typeof value) {
    case 'object':
      ttl = value.ttl;
      key = value.key;
      break;
    case 'number':
      ttl = value;
      break;
    case 'string':
      key = value;
      break;
  }

  const decorators: MethodDecorator[] = [];

  if (key) {
    decorators.push(CacheKey(key));
  }

  if (ttl) {
    decorators.push(CacheTTL(ttl));
  }

  decorators.push(UseInterceptors(CacheInterceptor));

  return applyDecorators(...decorators);
}
