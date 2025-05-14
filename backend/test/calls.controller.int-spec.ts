import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

describe('CallEvents E2E', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    beforeAll(async () => {
        const mockDataSource = {
            query: jest.fn().mockResolvedValue([]),
        };

        const module = await Test.createTestingModule({
            imports: [AppModule],
            providers: [
                {
                    provide: DataSource,
                    useValue: mockDataSource, 
                },
            ],
        }).compile();

        app = module.createNestApplication();
        await app.init();

        dataSource = module.get(DataSource);
    });

    beforeEach(async () => {
        jest.spyOn(dataSource, 'query').mockResolvedValue([
            {
                id: '123e4567-e89b-12d3-a456-426614174000',
                status: 'waiting',
                queueId: 'medical_spanish',
                startTime: new Date().toISOString(),
            },
        ]);
    });

    it('should retrieve calls', async () => {
        const res = await request(app.getHttpServer())
            .get('/api/calls')
            .set('x-api-key', process.env.API_KEY || 'mock-api-key');

        expect(res.status).toBe(200);
        expect(res.body).toEqual([
            expect.objectContaining({ queueId: 'medical_spanish' }),
        ]);
    });

    afterAll(async () => {
        await app.close();
    });
});
