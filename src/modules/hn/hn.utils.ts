import {
  NotFoundException,
  ServiceUnavailableException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { HN_API_BASE } from './hn.const';
import { RawItem } from './interfaces';

export async function fetchFromHn<T>(path: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${HN_API_BASE}${path}`);
  } catch {
    throw new ServiceUnavailableException('Failed to connect to HN API');
  }

  if (response.status === 404) {
    throw new NotFoundException(`Resource not found: ${path}`);
  }
  if (response.status === 429) {
    throw new ServiceUnavailableException('HN API rate limit exceeded');
  }
  if (response.status >= 500) {
    throw new ServiceUnavailableException(
      `HN API server error: ${response.status}`,
    );
  }
  if (response.status >= 400) {
    throw new BadRequestException(`HN API client error: ${response.status}`);
  }
  if (!response.ok) {
    throw new InternalServerErrorException(
      `Unexpected HN API error: ${response.status} ${response.statusText}`,
    );
  }

  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    throw new InternalServerErrorException('HN API returned non-JSON response');
  }

  return response.json() as Promise<T>;
}

export async function fetchItemFromHn(id: number): Promise<RawItem> {
  const item = await fetchFromHn<RawItem | null>(`/item/${id}.json`);
  if (item === null) {
    throw new NotFoundException(`Resource not found`);
  }

  return item;
}
