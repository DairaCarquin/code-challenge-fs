import { Inject, Injectable } from "@nestjs/common";
import { Call } from "src/domain/entities/call.entity";
import { CallRepositoryPort } from "src/domain/ports/outbound/call-repository.interface";
import { CallRepositoryPortToken } from "src/domain/ports/tokens";

@Injectable()
export class CallsService {
  constructor(
    @Inject(CallRepositoryPortToken)
    private readonly callRepo: CallRepositoryPort,
  ) { }

  async getCalls(status?: string, queueId?: string): Promise<Call[]> {
    if (status && queueId) {
      return this.callRepo.findByStatusAndQueue(status, queueId);
    } else if (status) {
      return this.callRepo.findByStatus(status);
    } else if (queueId) {
      return this.callRepo.findByQueue(queueId);
    } else {
      return this.callRepo.findAll();
    }
  }
}