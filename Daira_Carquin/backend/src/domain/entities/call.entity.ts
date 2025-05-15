export enum CallStatus {
    WAITING = 'waiting',
    ACTIVE = 'active',
    ANSWERED = 'answered',
    ON_HOLD = 'on_hold',
    ENDED = 'ended',
}

export class Call {
    constructor(
        public readonly id: string,
        public status: CallStatus,
        public queueId: string,
        public startTime: Date,
        public endTime?: Date,
    ) { }
}
