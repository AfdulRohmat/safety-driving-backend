import { IsNotEmpty } from "class-validator";

export class GetTravelRequestDTO {
    @IsNotEmpty()
    groupId: string;
}