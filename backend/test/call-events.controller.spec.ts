import { Test, TestingModule } from '@nestjs/testing';
import { CallEventService } from 'src/application/service/CallEventService';
import { CallEventDto, EventType } from 'src/shared/dto/call-event.dto';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CallEventsController } from 'src/infrastructure/controllers/call-events.controller';

describe('CallEventsController', () => {
  let controller: CallEventsController;
  let service: CallEventService;

  const mockService = {
    processEvent: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('mock-config-value'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      controllers: [CallEventsController],
      providers: [
        {
          provide: CallEventService,
          useValue: mockService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<CallEventsController>(CallEventsController);
    service = module.get<CallEventService>(CallEventService);
  });

  it('should call processEvent and return call_id', async () => {
    const dto: CallEventDto = {
      type: EventType.INITIATED,
      metadata: { queue_id: 'medical_spanish' },
    };

    const mockResult = { call_id: 'mock-uuid' };
    mockService.processEvent.mockResolvedValue(mockResult);

    const result = await controller.handleEvent(dto);

    expect(service.processEvent).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockResult);
  });
});
