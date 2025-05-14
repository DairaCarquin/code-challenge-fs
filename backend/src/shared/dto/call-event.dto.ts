import { IsEnum, IsObject, IsOptional, IsUUID, ValidateIf } from 'class-validator';

export enum EventType {
    INITIATED = 'call_initiated',
    ROUTED = 'call_routed',
    ANSWERED = 'call_answered',
    HOLD = 'call_hold',
    ENDED = 'call_ended',
}

export class CallEventDto {
    @IsEnum(EventType)
    type: EventType;

    @ValidateIf(o => o.type !== EventType.INITIATED)
    @IsUUID()
    @IsOptional()
    call_id?: string;

    @IsObject()
    metadata: Record<string, any>;

    @IsOptional()
    timestamp?: Date;
}
