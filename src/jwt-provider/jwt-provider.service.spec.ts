import { Test, TestingModule } from '@nestjs/testing';
import { JwtProviderService } from './jwt-provider.service';

describe('JwtProviderService', () => {
    let service: JwtProviderService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [JwtProviderService],
        }).compile();

        service = module.get<JwtProviderService>(JwtProviderService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
