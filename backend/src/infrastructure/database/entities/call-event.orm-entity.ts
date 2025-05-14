import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'call_event' })
export class CallEventOrmEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ name: 'call_id' })
    callId: string;

    @Column({ name: 'type' })
    type: string;

    @Column({ name: 'timestamp' })
    timestamp: Date;

    @Column({ type: 'jsonb', nullable: true, name: 'metadata' })
    metadata?: Record<string, any>;
}
