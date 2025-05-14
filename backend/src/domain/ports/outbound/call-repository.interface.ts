import { Call } from "src/domain/entities/call.entity";

export interface CallRepositoryPort {
    findById(id: string): Promise<Call | null>;
    create(call: Partial<Call>): Promise<Call>;
    updateStatus(id: string, status: string, endTime?: Date): Promise<void>;
    validateQueue(queueId: string): Promise<boolean>;
    findAll(): Promise<Call[]>;
    findByStatus(status: string): Promise<Call[]>;
    findByQueue(queueId: string): Promise<Call[]>;
    findByStatusAndQueue(status: string, queueId: string): Promise<Call[]>;
}
