import { PartialType } from '@nestjs/swagger';
import { CreateActivityDto } from './create-activity.dto.ts';

export class UpdateActivityDto extends PartialType(CreateActivityDto) {}
