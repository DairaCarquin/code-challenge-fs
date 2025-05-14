import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CallRepositoryPort } from 'src/domain/ports/outbound/call-repository.interface';
import { CallRepositoryPortToken } from 'src/domain/ports/tokens';
import { ConfigService } from '@nestjs/config';
import { CallsController } from 'src/infrastructure/controllers/calls.controller';
import { CallsService } from 'src/application/service/CallsService';

describe('CallRepository Integration (Mocked)', () => {
  let app: INestApplication;
  let mockCallRepository: Partial<CallRepositoryPort>;
  let mockConfigService: Partial<ConfigService>;

  beforeAll(async () => {
    mockConfigService = {
      get: jest.fn().mockReturnValue(process.env.API_KEY || 'mock-api-key'),
    };

    mockCallRepository = {
      findAll: jest.fn().mockResolvedValue([
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          status: 'waiting',
          queueId: 'medical_spanish',
          startTime: new Date().toISOString(),
        },
      ]),
      findByStatus: jest.fn().mockResolvedValue([
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          status: 'waiting',
          queueId: 'medical_spanish',
          startTime: new Date().toISOString(),
        },
      ]),
      findByQueue: jest.fn().mockResolvedValue([
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          status: 'waiting',
          queueId: 'medical_spanish',
          startTime: new Date().toISOString(),
        },
      ]),
      findByStatusAndQueue: jest.fn().mockResolvedValue([
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
          useValue: mockConfigService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('should retrieve mocked calls', async () => {
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
