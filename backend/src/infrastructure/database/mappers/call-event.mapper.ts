import { CallEvent } from "src/domain/entities/call-event.entity";
import { CallEventOrmEntity } from "../entities/call-event.orm-entity";

export class CallEventMapper {
  static toDomain(entity: CallEventOrmEntity): CallEvent {
    return {
      id: entity.id,
      callId: entity.callId,
      type: entity.type,
      timestamp: entity.timestamp,
      metadata: entity.metadata,
    };
  }

  static toOrm(event: Partial<CallEvent>): Partial<CallEventOrmEntity> {
    return {
      id: event.id,
      callId: { id: event.callId } as any,
      type: event.type,
      timestamp: event.timestamp,
      metadata: event.metadata,
    };
  }
}
