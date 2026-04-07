import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateWorkspaceDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:'Marketing team'})
    name: string;
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:'description of workspace'})
    description: string;

    @IsBoolean()
    @ApiProperty({default:false,description:'set the workspace to false'})
    isPrivate: boolean
}
