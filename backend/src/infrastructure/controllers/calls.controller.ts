import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CallsService } from 'src/application/service/CallsService';
import { ApiKeyGuard } from '../guards/api-key.guard';

@Controller('api')
@UseGuards(ApiKeyGuard)
export class CallsController {
  constructor(private readonly callsService: CallsService) { }

  @Get('/calls')
  async getCalls(
    @Query('status') status?: string,
    @Query('queue_id') queueId?: string,
  ) {
    return this.callsService.getCalls(status, queueId);
  }
}
