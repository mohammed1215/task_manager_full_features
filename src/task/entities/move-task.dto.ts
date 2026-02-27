import { IsInt, IsUUID } from "class-validator";

export class MoveTaskDto{
    @IsUUID()
    columnId: string;

    @IsInt()
    position: number
}