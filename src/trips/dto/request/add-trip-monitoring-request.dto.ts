import { IsNotEmpty } from "class-validator";

export class AddTripMonitoringRequestDTO {
    @IsNotEmpty()
    heartRate: number;

    @IsNotEmpty()
    latitude: string;

    @IsNotEmpty()
    longitude: string;

    @IsNotEmpty()
    status: string;

    @IsNotEmpty()
    kecepatan: number;
    
    @IsNotEmpty()
    rpm: number;
    
    @IsNotEmpty()
    thurttle: number;
   
    @IsNotEmpty()
    sudutPostural: number;
    
    @IsNotEmpty()
    kecepatanPostural: number;
    
    @IsNotEmpty()
    durasiPostural: number;

    @IsNotEmpty()
    tripToken: string
}