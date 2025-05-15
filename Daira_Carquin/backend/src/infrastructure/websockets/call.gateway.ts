import {
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class CallGateway {
    @WebSocketServer()
    server: Server;

    notify(eventType: string, data: any) {
        this.server.emit('new-event', { type: eventType, data });
    }
}
