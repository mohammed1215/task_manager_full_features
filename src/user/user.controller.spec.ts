import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

describe('UserController', () => {
    let controller: UserController;

    const mockUserService = {
        findOne: jest.fn((userId: string) => {
            return {
                id: userId,
                email: 'mohammedelbanawey264@gmail.com',
                firstname: 'Mohammed',
                lastname: 'Elbanawey',
            };
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [UserService],
        })
            .overrideProvider(UserService)
            .useValue(mockUserService)
            .compile();

        controller = module.get<UserController>(UserController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should return user object without password', async () => {
        const payload = {
            email: 'mohammedelbanawey264@gmail.com',
            userId: '123-uuid-123124',
        };

        //returned values
        const mockReturnedUser = {
            id: payload.userId,
            email: 'mohammedelbanawey264@gmail.com',
            firstname: 'Mohammed',
            lastname: 'Elbanawey',
        };

        const result = await controller.findMe(payload);
        expect(mockUserService.findOne).toHaveBeenCalledWith(payload.userId);
        expect(result).toMatchObject(mockReturnedUser);
    });
});
