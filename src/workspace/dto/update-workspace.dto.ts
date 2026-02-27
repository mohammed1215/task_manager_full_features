import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkspaceDto } from './create-workspace.dto';
import { IsOptional } from 'class-validator';

export class UpdateWorkspaceDto extends PartialType(CreateWorkspaceDto) {}
