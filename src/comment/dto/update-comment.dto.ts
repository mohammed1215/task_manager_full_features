import { PartialType } from '@nestjs/swagger';
import { CreateCommentDto } from './create-comment.dto.ts';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {}
