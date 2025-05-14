import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CallEventService } from "src/application/service/CallEventService";
import { CallEventDto } from "src/shared/dto/call-event.dto";
import { ApiKeyGuard } from "../guards/api-key.guard";

@UseGuards(ApiKeyGuard)
@Controller('api')
export class CallEventsController {
    constructor(private readonly service: CallEventService) { }

    @Post('/events')
    async handleEvent(@Body() dto: CallEventDto) {
        return this.service.processEvent(dto);
    }
}