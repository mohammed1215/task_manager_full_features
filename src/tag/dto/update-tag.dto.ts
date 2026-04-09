import { PartialType } from '@nestjs/swagger';
import { CreateTagDto } from './create-tag.dto.ts';

export class UpdateTagDto extends PartialType(CreateTagDto) {}
