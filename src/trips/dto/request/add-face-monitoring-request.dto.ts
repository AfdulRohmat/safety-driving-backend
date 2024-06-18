import { IsNotEmpty } from "class-validator";

export class AddFaceMonitoringRequestDTO {
    @IsNotEmpty()
    perclos: string;

    @IsNotEmpty()
    pebr: string;

    @IsNotEmpty()
    nYawn: string;

    @IsNotEmpty()
    kondisiKantuk: string;

    @IsNotEmpty()
    tripToken: string
}