import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CallOrmEntity } from "../entities/call.orm-entity";
import { Repository } from "typeorm";
import { Call, CallStatus } from "src/domain/entities/call.entity";
import { CallRepositoryPort } from "src/domain/ports/outbound/call-repository.interface";
import { CallMapper } from "../mappers/call.mapper";

@Injectable()
export class CallRepository implements CallRepositoryPort {
    constructor(
        @InjectRepository(CallOrmEntity)
        private readonly repo: Repository<CallOrmEntity>,
    ) { }

    async findById(id: string) {
        return this.repo.findOne({ where: { id } });
    }

    async create(call: Partial<Call>) {
        const newCall = this.repo.create(call);
        return this.repo.save(newCall);
    }

    async updateStatus(id: string, status: CallStatus, endTime?: Date) {
        const result = await this.repo.update(id, { status, endTime });
        console.log(`Update result for call ${id}:`, result);
        if (result.affected === 0) {
            console.warn(`❗️No call found with id ${id} to update`);
        }
    }

    async validateQueue(queueId: string) {
        return true;
    }

    async findAll(): Promise<Call[]> {
        const results = await this.repo.find();
        return results.map(CallMapper.toDomain);
    }

    async findByStatus(status: CallStatus): Promise<Call[]> {
        const results = await this.repo.find({ where: { status } });
        return results.map(CallMapper.toDomain);
    }

    async findByQueue(queueId: string): Promise<Call[]> {
        const results = await this.repo.find({ where: { queueId } });
        return results.map(CallMapper.toDomain);
    }

    async findByStatusAndQueue(status: CallStatus, queueId: string): Promise<Call[]> {
        const results = await this.repo.find({ where: { status, queueId } });
        return results.map(CallMapper.toDomain);
    }

}
