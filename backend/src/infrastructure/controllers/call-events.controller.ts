import { BadRequestException, Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { CallEventService } from "src/application/service/CallEventService";
import { CallEventDto } from "src/shared/dto/call-event.dto";
import { ApiKeyGuard } from "../guards/api-key.guard";
import { EventHistorySchema } from "src/application/validator/event-history.schema";

@UseGuards(ApiKeyGuard)
@Controller('api')
export class CallEventsController {
    constructor(private readonly service: CallEventService) { }

    @Post('/events')
    async handleEvent(@Body() dto: CallEventDto) {
        return this.service.processEvent(dto);
    }

    @Get('/events')
    async getGroupedHistory(
        @Query("status") status?: string,
        @Query("call_id") callId?: string,
    ) {
        try {
            EventHistorySchema.parse({ status, call_id: callId });
            return this.service.getGroupedEventHistory(status, callId);
        } catch (error: any) {
            throw new BadRequestException(error.errors);
        }
    }

}