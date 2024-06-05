import { IsNotEmpty } from "class-validator";

export class AddTripMonitoringRequestDTO {
    @IsNotEmpty()
    latitude: string;

    @IsNotEmpty()
    longitude: string;

    @IsNotEmpty()
    kecepatan: string;

    @IsNotEmpty()
    levelKantuk: string;

    @IsNotEmpty()
    tripToken: string
}