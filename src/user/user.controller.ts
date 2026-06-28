import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    UseGuards,
    UploadedFile,
    UseInterceptors,
    MaxFileSizeValidator,
    ParseFilePipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './decorator/user.decorator';
import { type jwtPayload } from '../interface/jwt-payload.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiConsumes,
    ApiBody,
    OmitType,
} from '@nestjs/swagger';
import { UpdateNotificationPreferenceDto } from './dto/update-notification-preference.dto';
import { User as UserType } from './entities/user.entity';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // @Get()
    // findAll() {
    //   return this.userService.findAll();
    // }

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //   return this.userService.findOne(id);
    // }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    //   return this.userService.update(+id, updateUserDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //   return this.userService.remove(+id);
    // }

    @Get('me')
    @UseGuards(JwtGuard)
    @ApiOperation({
        summary: 'Get current user profile',
        description: 'Retrieve authenticated user profile information',
    })
    @ApiResponse({
        status: 200,
        description: 'User profile retrieved successfully',
        type: class OmittedUser extends OmitType(UserType, [
            'password',
        ] as const) {},
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    findMe(@User() user: jwtPayload): Promise<UserType> {
        console.log(user);
        return this.userService.findOne(user.userId);
    }

    @Patch('me')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({
        summary: 'Update user profile',
        description: 'Update current user profile information',
    })
    @ApiResponse({ status: 200, description: 'Profile updated successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBody({ type: UpdateProfileDto })
    async updateProfile(
        @User() user: jwtPayload,
        @Body() updateProfileDto: UpdateProfileDto,
    ): Promise<{ message: string }> {
        return {
            message: await this.userService.updateProfile(
                user.userId,
                updateProfileDto,
            ),
        };
    }

    @Post('me/avatar')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('avatar'))
    @ApiOperation({
        summary: 'Upload user avatar',
        description: 'Upload a new avatar image for the current user (max 5MB)',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                avatar: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Avatar uploaded successfully' })
    @ApiResponse({
        status: 400,
        description: 'File too large or invalid format',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async uploadAvatar(
        @User() user: jwtPayload,
        @UploadedFile(
            new ParseFilePipe({
                fileIsRequired: true,
                validators: [
                    new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
                ],
            }),
        )
        file: Express.Multer.File,
    ): Promise<{ message: string; user: UserType }> {
        return this.userService.uploadAvatar(user.userId, file);
    }

    //notification preferences
    @Get('me/notification-preferences')
    @UseGuards(AuthGuard('jwt'))
    @ApiResponse({ status: 200, description: 'Success' })
    updateNotificationPreferences(
        @User() user: jwtPayload,
        updateNotificationPreferenceDto: UpdateNotificationPreferenceDto,
    ): Promise<{ message: string }> {
        return this.userService.updateNotificationPreferences(
            user.userId,
            updateNotificationPreferenceDto,
        );
    }
}
