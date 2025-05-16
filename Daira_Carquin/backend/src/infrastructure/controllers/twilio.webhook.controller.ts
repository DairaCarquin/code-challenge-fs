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
        const { callSid, accountSid, from, to, callStatus, apiVersion, direction, forwardedFrom, callerName, parentCallSid, timestamp, queue_id} = body;

        const event = this.mapTwillioEventType(callStatus);

        return {
            call_id: callSid,
            type: event,
            timestamp: timestamp ? new Date(timestamp) : new Date(),
            metadata: {
                from: from,
                to: to,
                account_sid: accountSid,
                api_version: apiVersion,
                direction: direction,
                forwarded_from: forwardedFrom,
                caller_name: callerName,
                parent_call_sid: parentCallSid,
                queue_id: queue_id,
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