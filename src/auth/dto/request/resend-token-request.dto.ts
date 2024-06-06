import { IsEmail, IsNotEmpty } from "class-validator";

export class ResendTokenRequestDTO {
    @IsEmail({}, { message: 'Invalid email' })
    @IsNotEmpty()
    email: string;
}