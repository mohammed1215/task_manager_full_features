import { PartialType } from '@nestjs/swagger';
import { CreateAttachmentDto } from './create-attachment.dto.ts';

export class UpdateAttachmentDto extends PartialType(CreateAttachmentDto) {}
