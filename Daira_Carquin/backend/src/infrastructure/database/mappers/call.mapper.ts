import { Call } from "src/domain/entities/call.entity";
import { CallOrmEntity } from "../entities/call.orm-entity";

export class CallMapper {
    static toDomain(entity: CallOrmEntity): Call {
        return new Call(
            entity.id,
            entity.status as any,
            entity.queueId,
            entity.startTime,
            entity.endTime,
        );
    }

    static toOrm(domain: Call): Partial<CallOrmEntity> {
        return {
            id: domain.id,
            status: domain.status,
            queueId: domain.queueId,
            startTime: domain.startTime,
            endTime: domain.endTime,
        };
    }
}