import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { Server } from 'ws';
import { TripsService } from "../trips.service";
import { AddFaceMonitoringRequestDTO } from "../dto/request/add-face-monitoring-request.dto";
import { from, map, Observable } from "rxjs";


@WebSocketGateway(80, {
    path: '/face-monitoring',
    cors: {
        origin: "*", // Update this with the appropriate origin or array of origins
        methods: ["GET", "POST"],
    }
})
export class FaceMonitoringGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly tripsService: TripsService) { }

    @WebSocketServer() server: Server;

    afterInit(server: any) {
        console.log('WebSocket initialized');
    }

    async handleConnection(client: any, ...args: any[]) {
        console.log('Client connected:', client.id);

    }

    handleDisconnect(client: any) {
        console.log('Client disconnected:', client.id);
    }

    @SubscribeMessage('faceMonitoring')
    handleAddFaceMonitoring(@MessageBody() addFaceMonitoringRequestDTO: AddFaceMonitoringRequestDTO): Observable<WsResponse<any>> {
        console.log("Data received: ", addFaceMonitoringRequestDTO)

        return from(this.tripsService.addFaceMonitoring(addFaceMonitoringRequestDTO)).pipe(
            map(faceMonitoring => ({ event: 'faceMonitoring', data: faceMonitoring }))
        );

        // const faceMonitoring = await this.tripsService.addFaceMonitoring(addFaceMonitoringRequestDTO);

        // this.server.emit('faceMonitoringData', faceMonitoring);
    }

} 