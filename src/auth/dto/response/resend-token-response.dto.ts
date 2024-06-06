
export class ResendTokenResponseDTO {
    email: string
    message: string | null

    constructor(email: string, message: string | null) {
        this.email = email;
        this.message = message
    }
}