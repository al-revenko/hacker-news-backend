import { IsArray, IsInt, ArrayNotEmpty } from 'class-validator';

export class GetCommentsBodyDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  ids: number[];
}
