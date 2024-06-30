import { IsNotEmpty } from "class-validator";

export class AddFaceMonitoringRequestDTO {
    @IsNotEmpty()
    perclos: string;

    @IsNotEmpty()
    tripToken: string
}