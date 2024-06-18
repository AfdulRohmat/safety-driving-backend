import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class GetDetailUserRequestDTO {
    @IsNotEmpty()
    @IsEmail()
    email: string;

}