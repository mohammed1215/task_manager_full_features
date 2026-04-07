import { IsArray } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AssignUsersToTaskDto {

    @IsArray()
    @ApiProperty({ example: ['uuid1', 'uuid2'], description: 'Array of user IDs to assign to task' })
    assigneeIds:string[];
}