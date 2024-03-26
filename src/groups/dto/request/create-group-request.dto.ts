import { IsNotEmpty } from "class-validator";

export class CreateGroupRequestDTO {
    @IsNotEmpty()
    nama_group: string

}