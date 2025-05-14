import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CallEventOrmEntity } from '../entities/call-event.orm-entity';
import { CallEvent } from 'src/domain/entities/call-event.entity';
import { CallEventRepositoryPort } from 'src/domain/ports/outbound/call-event-repository.interface';
import { CallEventMapper } from '../mappers/call-event.mapper';

@Injectable()
export class CallEventRepository implements CallEventRepositoryPort {
  constructor(
    @InjectRepository(CallEventOrmEntity)
    private readonly repo: Repository<CallEventOrmEntity>,
  ) { }

  async save(event: Partial<CallEvent>): Promise<CallEvent> {
    const ormEntity = this.repo.create(CallEventMapper.toOrm(event));
    const saved = await this.repo.save(ormEntity);
    return CallEventMapper.toDomain(saved);
  }
}
