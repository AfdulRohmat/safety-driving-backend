
export class GetAllUsersResponseDTO {
    id: number
    username: string
    email: string
    isVerified: boolean

    constructor(id: number, username: string,
        email: string,
        isVerified: boolean,
    ) {
        this.id = id
        this.username = username;
        this.email = email
        this.isVerified = isVerified
    }
}