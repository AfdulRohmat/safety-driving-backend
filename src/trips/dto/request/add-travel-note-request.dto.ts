import { IsNotEmpty } from "class-validator";

export class AddTripRequestDTO {
    @IsNotEmpty()
    alamatAwal: string;

    @IsNotEmpty()
    latitudeAwal: string;

    @IsNotEmpty()
    longitudeAwal: string;

    @IsNotEmpty()
    alamatTujuan: string;

    @IsNotEmpty()
    latitudeTujuan: string;

    @IsNotEmpty()
    longitudeTujuan: string;

    @IsNotEmpty()
    namaKendaraan: string;

    @IsNotEmpty()
    noPolisi: string;

    @IsNotEmpty()
    groupId: number

    @IsNotEmpty()
    driverId: number
}