import { PartialType } from '@nestjs/swagger';
import { CreateSearchDto } from './create-search.dto.ts';

export class UpdateSearchDto extends PartialType(CreateSearchDto) {}
