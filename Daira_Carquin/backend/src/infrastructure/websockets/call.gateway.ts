import {
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
@Injectable()
export class CallGateway {
    @WebSocketServer()
    server: Server;

    private logger = new Logger(CallGateway.name);

    notify(event: string, payload: any) {
        this.logger.debug(`Emitting: ${event}`, payload);
        this.server.emit(event, payload);
    }
}
