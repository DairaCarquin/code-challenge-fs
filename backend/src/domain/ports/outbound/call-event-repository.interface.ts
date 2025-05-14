import { CallEvent } from "src/domain/entities/call-event.entity";

export interface CallEventRepositoryPort {
  save(event: Partial<CallEvent>): Promise<CallEvent>;
  findAll(status?: string, call_id?: string): Promise<CallEvent[]>;
}
