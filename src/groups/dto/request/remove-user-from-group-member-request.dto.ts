import { IsNotEmpty } from "class-validator";

export class RemoveUserFromGroupMemberRequestDTO {
    @IsNotEmpty()
    user_id: number;

    @IsNotEmpty()
    group_id: number;
}