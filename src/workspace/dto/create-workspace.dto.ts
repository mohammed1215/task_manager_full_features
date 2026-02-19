import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateWorkspaceDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsBoolean()
    isPrivate: boolean
}
