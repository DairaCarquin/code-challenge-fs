import { Body, Controller, HttpException, HttpStatus, Post } from "@nestjs/common";
import { from } from "form-data";
import { CallEventService } from "src/application/service/CallEventService";
import { CallEventDto, EventType } from "src/shared/dto/call-event.dto";

@Controller('webhook/twilio')
export class TwilioWebhookController {
    constructor(
        private readonly callEventService: CallEventService,
    ) { }

    @Post()
    async handleTwilioWebhook(@Body() body: any) {
        try {
            const event = this.mapTwillioEvent(body);
            return await this.callEventService.processEvent(event);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }

    private mapTwillioEvent(body: any): CallEventDto {
        const { CallSid, AccountSid, From, To, CallStatus, ApiVersion, Direction, ForwardedFrom, CallerName, ParentCallSid, Timestamp } = body;

        const event = this.mapTwillioEventType(CallStatus);

        return {
            call_id: CallSid,
            type: event,
            timestamp: Timestamp ? new Date(Timestamp) : new Date(),
            metadata: {
                from: From,
                to: To,
                account_sid: AccountSid,
                api_version: ApiVersion,
                direction: Direction,
                forwarded_from: ForwardedFrom,
                caller_name: CallerName,
                parent_call_sid: ParentCallSid,
            }
        }
    }

    private mapTwillioEventType(status: string): EventType {
        switch (status.toLowerCase()) {
            case 'initiated':
                return EventType.INITIATED;
            case 'queued':
                return EventType.ROUTED;
            case 'in-progress':
                return EventType.ANSWERED;
            case 'on-hold':
                return EventType.HOLD;
            case 'completed':
                return EventType.ENDED;
            default:
                throw new Error(`Unknown Twilio event type: ${status}`);
        }
    }
}