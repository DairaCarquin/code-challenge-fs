import { Inject, Injectable, Logger } from "@nestjs/common";
import { CallStatus } from "src/domain/entities/call.entity";
import { CallEventRepositoryPort } from "src/domain/ports/outbound/call-event-repository.interface";
import { CallRepositoryPort } from "src/domain/ports/outbound/call-repository.interface";
import { CallEventRepositoryPortToken, CallRepositoryPortToken } from "src/domain/ports/tokens";
import { CallGateway } from "src/infrastructure/websockets/call.gateway";
import { CallEventDto, EventType } from "src/shared/dto/call-event.dto";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CallEventService {
    private logger = new Logger(CallEventService.name);

    constructor(
        @Inject(CallRepositoryPortToken)
        private readonly callRepo: CallRepositoryPort,

        @Inject(CallEventRepositoryPortToken)
        private readonly eventRepo: CallEventRepositoryPort,

        private readonly gateway: CallGateway,
    ) { }

    async processEvent(dto: CallEventDto) {
        this.logger.log(`Received event: ${JSON.stringify(dto)}`);
        const { call_id, type, metadata } = dto;
        const timestamp = dto.timestamp ?? new Date();

        let finalCallId: string;

        if (!call_id) {
            if (type === EventType.INITIATED) {
                finalCallId = uuidv4();
            } else {
                throw new Error(`Missing call_id for event type: ${type}`);
            }
        } else {
            if (!this.isUUID(call_id)) {
                throw new Error(`Invalid call_id format for event type: ${type}`);
            }
            finalCallId = call_id;
        }

        await this.eventRepo.save({
            id: uuidv4(),
            callId: finalCallId,
            type,
            timestamp,
            metadata,
        });

        switch (type) {
            case EventType.INITIATED:
                await this.handleInitiated(finalCallId, metadata);
                break;
            case EventType.ROUTED:
                await this.handleRouted(finalCallId, metadata);
                break;
            case EventType.ANSWERED:
                await this.handleAnswered(finalCallId, metadata);
                break;
            case EventType.HOLD:
                await this.handleHold(finalCallId, metadata);
                break;
            case EventType.ENDED:
                await this.handleEnded(finalCallId, metadata);
                break;
        }

        this.gateway.notify(type, {
            call_id: finalCallId,
            type,
            metadata,
            timestamp,
        });

        return { call_id: finalCallId };

    }

    private async handleInitiated(callId: string, metadata: any) {
        const exists = await this.callRepo.findById(callId);
        if (!exists) {
            const isValid = await this.callRepo.validateQueue(metadata.queue_id);
            if (!isValid) {
                throw new Error('Invalid queue_id');
            }
            await this.callRepo.create({
                id: callId,
                queueId: metadata.queue_id,
                status: CallStatus.WAITING,
                startTime: new Date(),
            });
        }

        setTimeout(() => {
            this.logger.warn(`SLA timer expired for call ${callId}`);
        }, 30_000);
    }

    private async handleRouted(callId: string, metadata: any) {
        if (metadata.routing_time > 15) {
            this.logger.warn(`Re-routing call ${callId} due to delay`);
        }
        await this.callRepo.updateStatus(callId, CallStatus.ACTIVE);
    }

    private async handleAnswered(callId: string, metadata: any) {
        if (metadata.wait_time > 30) {
            this.logger.warn(`Call ${callId} exceeded wait time. Alerting supervisor`);
        }
    }

    private async handleHold(callId: string, metadata: any) {
        if (metadata.hold_duration > 60) {
            this.logger.warn(`Hold time exceeded for call ${callId}`);
        }
        await this.callRepo.updateStatus(callId, CallStatus.ON_HOLD);
    }

    private async handleEnded(callId: string, metadata: any) {
        this.logger.debug(`handleEnded called for ${callId}`);

        if (metadata.duration < 10) {
            this.logger.warn(`Short call duration on ${callId}. Flagging for review`);
        }

        await this.callRepo.updateStatus(callId, CallStatus.ENDED, new Date());

        this.logger.log(`Sending post-call survey for call ${callId}`);
    }

    private isUUID(value: string): boolean {
        const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        return uuidRegex.test(value);
    }
}