import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class ReOrderColumnDto{
    @IsString()
    @IsNotEmpty()
    columnId:string;

    @IsInt()
    @Type(()=>Number)
    newPosition:number;
}