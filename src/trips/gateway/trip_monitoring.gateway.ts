import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, MessageBody, WsResponse } from '@nestjs/websockets';
import { Server } from 'ws';
// import { Server, Socket } from 'socket.io';
import { TripsService } from '../trips.service';
import { AddTripMonitoringRequestDTO } from '../dto/request/add-trip-monitoring-request.dto';
import { from, map, Observable } from 'rxjs';
import { Socket } from 'dgram';

@WebSocketGateway(2020, {
    path: "/trip-monitoring",
    // namespace: "/trip-monitoring", for socket io only
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
})
export class TripMonitoringGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    constructor(private readonly tripsService: TripsService) { }

    afterInit(server: any) {
        console.log('WebSocket initialized');
    }

    async handleConnection(client: any, ...args: any[]) {
        console.log('Client connected:', client.id);

    }

    handleDisconnect(client: any) {
        console.log('Client disconnected:', client.id);
    }

    // for wss
    @SubscribeMessage('tripMonitoring')
    handleAddTripMonitoring(@MessageBody() addTripMonitoringRequestDTO: AddTripMonitoringRequestDTO,) {
        // Handle the incoming data, e.g., save to database
        console.log(`Data received: `, addTripMonitoringRequestDTO);

        return from(this.tripsService.addTripMonitoring(addTripMonitoringRequestDTO)).pipe(
            map(trip => ({ event: 'tripMonitoring', data: trip }))
        );
    }




    // @SubscribeMessage('addTripMonitoring')
    // async handleTripData(@MessageBody() addTripMonitoringRequestDTO: AddTripMonitoringRequestDTO) {
    //     console.log(`Data received: `, addTripMonitoringRequestDTO);

    //     const tripMonitoring = await this.tripsService.addTripMonitoring(addTripMonitoringRequestDTO)
    //     // Broadcast the trip data to all connected clients
    //     this.server.emit('tripMonitoringData', tripMonitoring);
    // }
}
