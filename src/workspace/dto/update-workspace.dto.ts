import { PartialType } from '@nestjs/swagger';
import { CreateWorkspaceDto } from './create-workspace.dto.ts';

export class UpdateWorkspaceDto extends PartialType(CreateWorkspaceDto) {}
