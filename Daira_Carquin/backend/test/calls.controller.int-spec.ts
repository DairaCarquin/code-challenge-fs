import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CallRepositoryPort } from 'src/domain/ports/outbound/call-repository.interface';
import { CallRepositoryPortToken } from 'src/domain/ports/tokens';
import { CallsController } from 'src/infrastructure/controllers/calls.controller';
import { CallsService } from 'src/application/service/CallsService';
import { ConfigService } from '@nestjs/config';

describe('CallsController (mocked repo)', () => {
    let app: INestApplication;
    let mockCallRepository: Partial<CallRepositoryPort>;

    beforeAll(async () => {
        mockCallRepository = {
            findAll: jest.fn().mockResolvedValue([
                {
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    status: 'waiting',
                    queueId: 'medical_spanish',
                    startTime: new Date().toISOString(),
                },
            ]),
        };

        const module = await Test.createTestingModule({
            controllers: [CallsController],
            providers: [
                CallsService,
                {
                    provide: CallRepositoryPortToken,
                    useValue: mockCallRepository,
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue('mock-api-key'),
                    },
                },
            ],
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    it('should return mocked call data', async () => {
        const res = await request(app.getHttpServer())
            .get('/api/calls')
            .set('x-api-key', 'mock-api-key');

        expect(res.status).toBe(200);
        expect(res.body).toEqual([
            expect.objectContaining({ queueId: 'medical_spanish' }),
        ]);
    });

    afterAll(async () => {
        await app.close();
    });
});
