import { IsNotEmpty } from "class-validator";

export class AddTripMonitoringRequestDTO {
    @IsNotEmpty()
    heartRate: string;

    @IsNotEmpty()
    latitude: string;

    @IsNotEmpty()
    longitude: string;

    @IsNotEmpty()
    status: string;

    @IsNotEmpty()
    kecepatan: string;
    
    @IsNotEmpty()
    rpm: string;
    
    @IsNotEmpty()
    thurttle: string;
   
    @IsNotEmpty()
    sudutPostural: string;
    
    @IsNotEmpty()
    kecepatanPostural: string;
    
    @IsNotEmpty()
    durasiPostural: string;

    @IsNotEmpty()
    tripToken: string
}