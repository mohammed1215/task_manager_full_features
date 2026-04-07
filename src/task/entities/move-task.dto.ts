import { IsInt, IsUUID ,Min} from "class-validator";
import {Type} from 'class-transformer'
import { ApiProperty } from "@nestjs/swagger";

export class MoveTaskDto{
    @IsUUID()
    @Type(()=>String)
    @ApiProperty({ example: 'uuid', description: 'Target column UUID' })
    columnId: string;

    @Type(()=>Number)
    @IsInt()
    @Min(0)
    @ApiProperty({ example: 0, minimum: 0, description: 'New position in column' })
    position: number
}
