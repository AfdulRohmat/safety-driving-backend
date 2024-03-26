import { IsNotEmpty } from "class-validator";

export class AddingUserToGroupMemberRequestDTO {
    @IsNotEmpty()
    user_id: number;

    @IsNotEmpty()
    group_id: number;

    @IsNotEmpty()
    role: string
}