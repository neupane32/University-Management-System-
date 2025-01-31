import { IsNotEmpty, IsString } from "class-validator";

export class ProgramInterface {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    duration: string;
}