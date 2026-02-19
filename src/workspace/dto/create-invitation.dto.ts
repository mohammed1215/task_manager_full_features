import { IsEmail, IsEnum, IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { WorkspaceMemberRoles } from "src/workspace-member/enum/WorkspaceMember.enum";

const AllowedRoles = Object.values(WorkspaceMemberRoles).filter((role)=> role!== WorkspaceMemberRoles.owner)
export class CreateInvitationDto {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email:string;

    @IsString()
    @IsNotEmpty()
    @IsIn(AllowedRoles,{
        message:`Role must be one of: ${AllowedRoles.join(', ')}`
    })
    role:Exclude<WorkspaceMemberRoles,WorkspaceMemberRoles.owner>;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    message?:string;
}