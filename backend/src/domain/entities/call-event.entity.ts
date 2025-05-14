export class CallEvent {
    constructor(
        public readonly id: string,
        public readonly callId: string,
        public readonly type: string,
        public readonly timestamp: Date,
        public readonly metadata?: Record<string, any>,
    ) { }
}
