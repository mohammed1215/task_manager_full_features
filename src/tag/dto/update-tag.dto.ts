import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateTagDto } from './create-tag.dto';

export class UpdateTagDto extends PartialType(
    OmitType(CreateTagDto, ['groupName'] as const),
) {}
