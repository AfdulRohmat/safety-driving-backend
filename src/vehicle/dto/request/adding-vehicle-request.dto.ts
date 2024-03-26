import { IsNotEmpty } from "class-validator";

export class AddingVehicleDataRequestDTO {
    @IsNotEmpty()
    nama: string;

    @IsNotEmpty()
    no_polisi: string

    @IsNotEmpty()
    detail: string

    @IsNotEmpty()
    group_id: number

    // @IsNotEmpty()
    driver_id: number
}