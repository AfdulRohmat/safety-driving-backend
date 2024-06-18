import { IsNotEmpty } from "class-validator";

export class AddTripMonitoringRequestDTO {
    @IsNotEmpty()
    posisiPedalGas: string;

    @IsNotEmpty()
    heartRate: string;

    @IsNotEmpty()
    latitude: string;

    @IsNotEmpty()
    longitude: string;

    @IsNotEmpty()
    kecepatan: string;

    @IsNotEmpty()
    kondisiKantuk: string;

    @IsNotEmpty()
    tripToken: string
}