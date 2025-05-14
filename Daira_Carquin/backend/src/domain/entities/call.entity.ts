export enum CallStatus {
    WAITING = 'waiting',
    ACTIVE = 'active',
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
