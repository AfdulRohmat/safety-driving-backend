import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, Min } from "class-validator";

export class GetDetailGroupRequestDTO {
    @IsNotEmpty()
    group_id: number
}