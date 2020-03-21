import { IsString } from 'class-validator';

export class CreateCommentDTO {
  @IsString()
  body: string;
}
