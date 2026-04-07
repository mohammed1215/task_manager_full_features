import { ApiProperty } from "@nestjs/swagger";

export class CreateActivityDto {
    @ApiProperty({ example: 'Task updated', description: 'Activity action or description' })
    action?: string;
}
