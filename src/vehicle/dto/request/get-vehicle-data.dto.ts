import { IsNotEmpty } from "class-validator"

export class GetVehicleDataRequestDTO {
    @IsNotEmpty()
    group_id: number
}