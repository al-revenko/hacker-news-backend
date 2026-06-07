import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class DepthDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  depth?: number = 0;
}
