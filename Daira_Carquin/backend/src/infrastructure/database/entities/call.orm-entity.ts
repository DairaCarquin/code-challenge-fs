import { CallStatus } from "src/domain/entities/call.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'call' })
export class CallOrmEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ default: CallStatus.WAITING, name: 'status' })
    status: CallStatus;

    @Column({ name: 'queue_id' })
    queueId: string;

    @Column({ name: 'start_time' })
    startTime: Date;

    @Column({ nullable: true, name: 'end_time' })
    endTime?: Date;
}
