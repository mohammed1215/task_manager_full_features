import { IsArray } from "class-validator";

export class AssignUsersToTaskDto {

    @IsArray()
    assigneeIds:string[];
}