import { IsNotEmpty, IsOptional } from "class-validator";

export class GetTravelRequestDTO {
    @IsNotEmpty()
    groupId: string;

    @IsOptional()
    status?: string
}