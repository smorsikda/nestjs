import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({ required: true, example: 'admin@techsolutions.com' })
    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    @IsNotEmpty({ message: 'El correo es requerido' })
    email: string;

    @ApiProperty({ required: true, example: 'password123' })
    @IsString()
    @IsNotEmpty({ message: 'La contraseña es requerida' })
    password: string;
}