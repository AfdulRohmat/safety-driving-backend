import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TripsService } from '../trips.service';
import { AddTripMonitoringRequestDTO } from '../dto/request/add-trip-monitoring-request.dto';

@WebSocketGateway()
export class TripGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    constructor(private readonly tripsService: TripsService) { }

    afterInit(server: Server) {
        console.log('WebSocket initialized');
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log('Client connected:', client.id);
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected:', client.id);
    }

    @SubscribeMessage('addTripMonitoring')
    async handleAddTripMonitoring(@MessageBody() addTripMonitoringRequestDTO: AddTripMonitoringRequestDTO) {
        // Handle the incoming data, e.g., save to database
        console.log(`Data received: lat=${addTripMonitoringRequestDTO.latitude}, lng=${addTripMonitoringRequestDTO.longitude}, kecepatan=${addTripMonitoringRequestDTO.kecepatan}, levelKantuk=${addTripMonitoringRequestDTO.kondisiKantuk}, tripToken=${addTripMonitoringRequestDTO.tripToken}`);

        // Validate and save data to the database
        const trip = await this.tripsService.addTripMonitoring(addTripMonitoringRequestDTO);

        // Optionally emit the saved trip data back to all connected clients
        this.server.emit('tripCreated', trip);
    }
}
