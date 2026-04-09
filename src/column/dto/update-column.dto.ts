import { PartialType } from '@nestjs/swagger';
import { CreateColumnDto } from './create-column.dto.ts';

export class UpdateColumnDto extends PartialType(CreateColumnDto) {}
