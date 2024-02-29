import { IsNotEmpty, MinLength } from "class-validator";

export class AddDetailUserRequestDTO {
    @IsNotEmpty()
    @MinLength(4)
    nama_depan: string;

    @IsNotEmpty()
    @MinLength(4)
    nama_belakang: string;

    @IsNotEmpty()
    jenis_kelamin: string;

    @IsNotEmpty()
    tempat_lahir: string;

    @IsNotEmpty()
    tanggal_lahir: Date;
}