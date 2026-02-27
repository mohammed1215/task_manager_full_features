import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class CreateColumnDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}
